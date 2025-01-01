import {
  type ComponentInternalInstance,
  type ConcreteComponent,
  isVNode,
  type ShallowRef,
  type VNodeArrayChildren,
  type VNodeChild,
} from "vue";

export type ChildrenMapper<I, O> = (
  children: ReadonlyArray<ChildInfo<I>>,
) => ReadonlyArray<O>;

function* walkChildren<I, O>(
  child: VNodeChild,
  lookup: Map<number, ChildRef<I, O>>,
  skipSubtreesOf: ReadonlySet<ConcreteComponent>,
): Generator<ChildRef<I, O> | number> {
  const queue = Array.isArray(child) ? Array.from(child) : [child];
  let index = 0;
  let depth = 0;
  const riseAt = [] as VNodeArrayChildren;

  while (queue.length) {
    const vnode = queue.shift();

    if (vnode === null) {
      break;
    }

    while (riseAt.length > 0 && riseAt[0] === vnode) {
      riseAt.shift();
      depth--;
      yield depth;
    }

    if (Array.isArray(vnode) && vnode.length > 0) {
      queue.unshift(...vnode);

      continue;
    }

    if (isVNode(vnode)) {
      if (vnode.component) {
        const element = lookup.get(vnode.component.uid);
        if (element) {
          element.depth = depth;
          yield element;
          index++;
        }
        if (index === lookup.size) {
          break;
        }

        if (vnode === child || !skipSubtreesOf.has(vnode.component.type)) {
          queue.unshift(vnode.component.subTree);
        }
      } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
        if (queue[0] != null) {
          riseAt.unshift(queue[0]);
        }
        depth++;
        yield depth;

        queue.unshift(...vnode.children);
      }
    }
  }
}

class ChildInfo<I> {
  readonly #ref: ChildRef<I, unknown>;

  constructor(ref: ChildRef<I, unknown>) {
    this.#ref = ref;
  }

  get input(): I {
    return this.#ref.input.value;
  }

  *before() {
    for (const ref of this.#ref.ancestors) {
      yield ref.info;
    }
  }

  *after() {
    let ref: ChildRef<I, unknown> | undefined = this.#ref;

    while (ref != null) {
      for (const ref of this.#ref.peers.slice(
        this.#ref.peers.indexOf(this.#ref) + 1,
      )) {
        yield ref.info;
      }

      ref = ref.ancestors.at(-1);
    }
  }
}

export type { ChildInfo };

class ChildRef<I, O> {
  depth: number = 0;
  peers: ReadonlyArray<ChildRef<I, O>> = [];
  ancestors: ReadonlyArray<ChildRef<I, O>> = [];

  readonly uid: number;
  readonly input: Readonly<Ref<I>>;
  readonly output: ShallowRef<O> | null;
  readonly #info: ChildInfo<I>;

  constructor(
    context: ChildrenContext<I, O>,
    uid: number,
    input: Readonly<Ref<I>>,
    initial: O | undefined,
  ) {
    this.uid = uid;
    this.input = input;
    this.output = initial === undefined ? null : shallowRef(initial);

    watch(
      input,
      () => {
        context.update(this);
      },
      { flush: "sync" },
    );

    this.#info = new ChildInfo(this);
  }

  get info() {
    return this.#info;
  }

  compare(other: ChildRef<I, O> | undefined): boolean {
    return (
      other != null && this.uid === other.uid && this.input === other.input
    );
  }
}

class ChildrenContext<I, O = never> {
  readonly order: ShallowRef<ReadonlyArray<ChildRef<I, O>>>;
  readonly info: ShallowRef<ReadonlyArray<ChildInfo<I>>>;

  readonly #vm: ComponentInternalInstance;
  readonly #storage: Map<number, ChildRef<I, O>>;
  readonly #updateTrigger: ShallowRef<number>;

  readonly #skipSubtreesOf: ReadonlySet<ConcreteComponent>;

  constructor(vm: ComponentInternalInstance, map?: ChildrenMapper<I, O>) {
    this.#vm = vm;
    this.#skipSubtreesOf = new Set([vm.type]);

    this.#storage = new Map<number, ChildRef<I, O>>();

    const order = shallowRef<ReadonlyArray<ChildRef<I, O>>>([]);
    const info = shallowRef<ReadonlyArray<ChildInfo<I>>>([]);

    const updateTrigger = shallowRef(0);

    watch(
      updateTrigger,
      () => {
        const incoming = [] as Array<ChildRef<I, O>>;
        const peerLists = new Map<number, Array<ChildRef<I, O>>>();
        let depth = 0;

        let needsUpdate = false;

        for (const value of walkChildren(
          this.#vm.vnode,
          this.#storage,
          this.#skipSubtreesOf,
        )) {
          if (typeof value === "number") {
            if (value < depth) {
              peerLists.delete(depth);
            }
            depth = value;
          } else {
            value.depth = depth;
            const peers = peerLists.get(depth) ?? [];
            peerLists.set(depth, peers);
            peers.push(value);
            value.peers = peers;

            const ancestors = [] as Array<ChildRef<I, O>>;
            for (const list of peerLists.values()) {
              if (list !== peers) {
                ancestors.push(...list);
              }
            }
            value.ancestors = ancestors;

            if (
              !needsUpdate &&
              !value.compare(this.order.value[incoming.length])
            ) {
              needsUpdate = true;
            }

            incoming.push(value);
          }
        }

        if (needsUpdate) {
          order.value = incoming;
          const incomingInfo: Array<ChildInfo<I>> = [];
          for (const ref of incoming) {
            incomingInfo.push(ref.info);
          }

          info.value = incomingInfo;
        }
      },
      { flush: "pre" },
    );

    if (map !== undefined) {
      watchEffect(
        () => {
          const outputs = map(info.value);
          if (outputs.length !== info.value.length) {
            throw new Error(
              "mapper returned different number of outputs than inputs",
            );
          }

          for (const index in order.value) {
            const child = order.value[index] as ChildRef<I, O>;
            if (child.output === null) {
              throw new Error(
                "mapper returned output for child that has no initial value",
              );
            }

            child.output.value = outputs[index] as O;
          }
        },
        { flush: "post" },
      );
    }

    this.order = order;
    this.info = info;
    this.#updateTrigger = updateTrigger;
  }

  register(ref: ChildRef<I, O>) {
    this.#storage.set(ref.uid, ref);
    triggerRef(this.#updateTrigger);
  }

  unregister(ref: ChildRef<I, O>) {
    this.#storage.delete(ref.uid);
    triggerRef(this.#updateTrigger);
  }

  update(ref: ChildRef<I, O>) {
    const index = this.order.value.indexOf(ref) as number;
    if (index < 0) {
      return;
    }
    triggerRef(this.info);
  }
}

export interface UseChildrenReturn<I> {
  info: Readonly<ShallowRef<ReadonlyArray<ChildInfo<I>>>>;
}

export function useChildren<I>(channel: string): UseChildrenReturn<I>;
export function useChildren<I, O>(
  channel: string,
  map: ChildrenMapper<I, O>,
): UseChildrenReturn<I>;
export function useChildren<I, O = never>(
  channel: string,
  map?: ChildrenMapper<I, O>,
): UseChildrenReturn<I> {
  const vm = getCurrentInstance();

  if (!vm) {
    throw new Error("useChildIndex must be used inside a component");
  }

  const context = new ChildrenContext<I, O>(vm, map);

  provide(
    Symbol.for(`use-children:${channel}`) as InjectionKey<
      ChildrenContext<I, O>
    >,
    context,
  );

  return {
    info: context.info,
  };
}

export function useChild<I>(channel: string, value: MaybeRefOrGetter<I>): void;
export function useChild<I, O>(
  channel: string,
  value: MaybeRefOrGetter<I>,
  initial: O,
): Readonly<Ref<O>>;
export function useChild<I, O = never>(
  channel: string,
  value: MaybeRefOrGetter<I>,
  initial?: O,
): Readonly<ShallowRef<O>> | undefined {
  const context = inject(
    Symbol.for(`use-children:${channel}`) as InjectionKey<
      ChildrenContext<I, O>
    >,
    null,
  );

  if (!context) {
    throw new Error("useChildIndex must be used inside a useChildren");
  }

  const vm = getCurrentInstance();

  if (!vm) {
    throw new Error("useChildIndex must be used inside a component");
  }

  const ref = new ChildRef<I, O>(
    context,
    vm.uid,
    toRef(value) as Ref<I>,
    initial,
  );

  context.register(ref);

  onBeforeUnmount(() => {
    context.unregister(ref);
  });

  if (ref.output) {
    return ref.output;
  }
}
