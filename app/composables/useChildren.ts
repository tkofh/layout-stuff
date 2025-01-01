import {
  type ComponentInternalInstance,
  type ConcreteComponent,
  isVNode,
  type ShallowRef,
  type VNodeArrayChildren,
  type VNodeChild,
} from "vue";

export type ChildrenMapper<I, O> = (
  children: ReadonlyArray<Child<I, O>>,
) => void;

function* walkChildren<I, O>(
  child: VNodeChild,
  lookup: Map<number, Child<I, O>>,
  skipSubtreesOf: ReadonlySet<ConcreteComponent>,
): Generator<Child<I, O> | number> {
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

class Child<I, O> {
  peers: ReadonlyArray<Child<I, O>> = [];
  ancestors: ReadonlyArray<Child<I, O>> = [];

  readonly uid: number;
  readonly input: Readonly<Ref<I>>;
  readonly output: ShallowRef<O> | null;

  // readonly #info: ChildInfo<I>;

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
  }

  *before() {
    for (const ref of this.ancestors) {
      yield ref;
    }
  }

  *after() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: Child<I, O> | undefined = this;

    while (current != null) {
      for (const ref of current.peers.slice(
        current.peers.indexOf(current) + 1,
      )) {
        yield ref;
      }

      current = current.ancestors.at(-1);
    }
  }

  compare(other: Child<I, O> | undefined): boolean {
    return (
      other != null && this.uid === other.uid && this.input === other.input
    );
  }
}

class ChildrenContext<I, O = never> {
  readonly children: ShallowRef<ReadonlyArray<Child<I, O>>>;

  readonly #vm: ComponentInternalInstance;
  readonly #storage: Map<number, Child<I, O>>;
  readonly #updateTrigger: ShallowRef<number>;

  readonly #skipSubtreesOf: ReadonlySet<ConcreteComponent>;

  constructor(vm: ComponentInternalInstance, map?: ChildrenMapper<I, O>) {
    this.#vm = vm;
    this.#skipSubtreesOf = new Set([vm.type]);

    this.#storage = new Map<number, Child<I, O>>();

    const children = shallowRef<ReadonlyArray<Child<I, O>>>([]);

    const updateTrigger = shallowRef(0);

    watch(
      updateTrigger,
      () => {
        const incoming = [] as Array<Child<I, O>>;
        const peerLists = new Map<number, Array<Child<I, O>>>();
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
            const peers = peerLists.get(depth) ?? [];
            peerLists.set(depth, peers);
            peers.push(value);
            value.peers = peers;

            const ancestors = [] as Array<Child<I, O>>;
            for (const list of peerLists.values()) {
              if (list !== peers) {
                ancestors.push(...list);
              }
            }
            value.ancestors = ancestors;

            if (
              !needsUpdate &&
              !value.compare(this.children.value[incoming.length])
            ) {
              needsUpdate = true;
            }

            incoming.push(value);
          }
        }

        if (needsUpdate) {
          children.value = incoming;
          const incomingInfo: Array<Child<I, O>> = [];
          for (const ref of incoming) {
            incomingInfo.push(ref);
          }

          children.value = incomingInfo;
        }
      },
      { flush: "pre" },
    );

    if (map !== undefined) {
      watchEffect(
        () => {
          map(children.value);
        },
        { flush: "post" },
      );
    }

    this.children = children;
    this.#updateTrigger = updateTrigger;
  }

  register(ref: Child<I, O>) {
    this.#storage.set(ref.uid, ref);
    triggerRef(this.#updateTrigger);
  }

  unregister(ref: Child<I, O>) {
    this.#storage.delete(ref.uid);
    triggerRef(this.#updateTrigger);
  }

  update(ref: Child<I, O>) {
    const index = this.children.value.indexOf(ref) as number;
    if (index < 0) {
      return;
    }
    triggerRef(this.children);
  }
}

export function useChildren<I, O = never>(
  channel: string,
  handler: ChildrenMapper<I, O>,
) {
  const vm = getCurrentInstance();

  if (!vm) {
    throw new Error("useChildIndex must be used inside a component");
  }

  const context = new ChildrenContext<I, O>(vm, handler);

  provide(
    Symbol.for(`use-children:${channel}`) as InjectionKey<
      ChildrenContext<I, O>
    >,
    context,
  );
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

  const ref = new Child<I, O>(context, vm.uid, toRef(value) as Ref<I>, initial);

  context.register(ref);

  onBeforeUnmount(() => {
    context.unregister(ref);
  });

  if (ref.output) {
    return ref.output;
  }
}
