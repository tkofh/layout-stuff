import {
  type ComponentInternalInstance,
  isVNode,
  type ShallowRef,
  type VNodeArrayChildren,
} from "vue";

export type ChildrenMapper<I, O> = (
  children: ReadonlyArray<Child<I, O>>,
) => void;

function* vnodeChildrenOf(vnode: VNode): Generator<VNode> {
  if (vnode.component?.subTree) {
    yield vnode.component.subTree;
  } else if (Array.isArray(vnode.children)) {
    for (const child of vnode.children) {
      if (isVNode(child)) {
        yield child;
      }
    }
  }
}

function* walkChildComponents(
  root: VNode,
  shouldTraverseChildrenOf: (vnode: VNode) => boolean,
): Generator<ComponentInternalInstance | number> {
  const queue = Array.from(vnodeChildrenOf(root));
  let depth = 0;
  const riseAt = [] as VNodeArrayChildren;

  while (queue.length) {
    const vnode = queue.shift();

    if (vnode == null) {
      break;
    }

    while (riseAt.length > 0 && riseAt[0] === vnode) {
      riseAt.shift();
      depth--;
      yield depth;
    }

    if (vnode.component) {
      yield vnode.component;
    }

    if (!shouldTraverseChildrenOf(vnode)) {
      continue;
    }

    if (typeof vnode.type === "string") {
      if (queue[0] != null) {
        riseAt.unshift(queue[0]);
      }
      depth++;
      yield depth;
    }
    queue.unshift(...vnodeChildrenOf(vnode));
  }
}

class Child<I, O> {
  siblings: ReadonlyArray<Child<I, O>> = [];
  ancestors: ReadonlyArray<Child<I, O>> = [];

  readonly uid: number;
  readonly input: Readonly<Ref<I>>;
  readonly output: ShallowRef<O> | null;

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
    for (const ref of this.siblings) {
      if (ref === this) {
        break;
      }
      yield ref;
    }
  }

  *after() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: Child<I, O> | undefined = this;

    while (current != null) {
      for (const ref of current.siblings.slice(
        current.siblings.indexOf(current) + 1,
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

  constructor(vm: ComponentInternalInstance, map?: ChildrenMapper<I, O>) {
    this.#vm = vm;

    this.#storage = new Map<number, Child<I, O>>();
    const children = shallowRef<ReadonlyArray<Child<I, O>>>([]);
    const updateTrigger = shallowRef(0);

    watch(
      updateTrigger,
      () => {
        const children = [] as Array<Child<I, O>>;
        const siblingLists = new Map<number, Array<Child<I, O>>>();
        let depth = 0;

        for (const value of walkChildComponents(
          this.#vm.vnode,
          (vnode) =>
            vnode !== this.#vm.vnode && vnode.component?.type !== this.#vm.type,
        )) {
          if (typeof value === "number") {
            if (value < depth) {
              siblingLists.delete(depth);
            }
            depth = value;
          } else if (this.#storage.has(value.uid)) {
            const child = this.#storage.get(value.uid) as Child<I, O>;

            const siblings = siblingLists.get(depth) ?? [];
            siblingLists.set(depth, siblings);
            siblings.push(child);
            child.siblings = siblings;

            const ancestors: Array<Child<I, O>> = [];
            for (const list of siblingLists.values()) {
              if (list !== siblings) {
                ancestors.push(...list);
              }
            }
            child.ancestors = ancestors;

            children.push(child);

            if (children.length === this.#storage.size) {
              break;
            }
          }
        }

        this.children.value = children;
      },
      { flush: "pre" },
    );

    if (map !== undefined) {
      watchEffect(
        () => {
          if (children.value.length > 0) {
            map(children.value);
          }
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
