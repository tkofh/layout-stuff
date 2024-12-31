import {
  type ComponentInternalInstance,
  type ConcreteComponent,
  isVNode,
  type ShallowRef,
  type VNodeChild,
} from "vue";

export type ChildrenMapper<I, O> = (
  inputs: ReadonlyArray<I>,
) => ReadonlyArray<O>;

function* walkChildren<I, O>(
  child: VNodeChild,
  lookup: Map<number, ChildRef<I, O>>,
  skipSubtreesOf: ReadonlySet<ConcreteComponent>,
): Generator<ChildRef<I, O>> {
  const queue = Array.isArray(child) ? [...child] : [child];
  let index = 0;
  while (queue.length) {
    const vnode = queue.shift();

    if (vnode === null) {
      break;
    }

    if (Array.isArray(vnode)) {
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
      } else if (Array.isArray(vnode.children)) {
        queue.unshift(...vnode.children);
      }
    }
  }
}

class ChildRef<I, O> {
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
}

class ChildrenContext<I, O = never> {
  readonly order: ShallowRef<ReadonlyArray<ChildRef<I, O>>>;
  readonly inputs: ShallowRef<ReadonlyArray<I>>;

  readonly #vm: ComponentInternalInstance;
  readonly #storage: Map<number, ChildRef<I, O>>;
  readonly #updateTrigger: ShallowRef<number>;

  readonly #skipSubtreesOf: ReadonlySet<ConcreteComponent>;

  constructor(vm: ComponentInternalInstance, map?: ChildrenMapper<I, O>) {
    this.#vm = vm;
    this.#skipSubtreesOf = new Set([vm.type]);

    this.#storage = new Map<number, ChildRef<I, O>>();

    const order = shallowRef<ReadonlyArray<ChildRef<I, O>>>([]);
    const inputs = shallowRef<ReadonlyArray<I>>([]);

    const updateTrigger = shallowRef(0);

    watch(
      updateTrigger,
      () => {
        const incoming = Array.from(
          walkChildren(this.#vm.vnode, this.#storage, this.#skipSubtreesOf),
        );

        let orderChanged = incoming.length !== order.value.length;

        if (!orderChanged) {
          for (const i in incoming) {
            if (incoming[i] !== order.value[i]) {
              orderChanged = true;
              break;
            }
          }
        }

        if (orderChanged) {
          order.value = incoming;
          const incomingInputs: Array<I> = [];

          for (const ref of incoming) {
            incomingInputs.push(ref.input.value);
          }

          inputs.value = incomingInputs;
        }
      },
      { flush: "pre" },
    );

    if (map !== undefined) {
      watchEffect(() => {
        const outputs = map(inputs.value);

        if (outputs.length !== inputs.value.length) {
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
      });
    }

    this.order = order;
    this.inputs = inputs;
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

    this.inputs.value = this.inputs.value.with(index, ref.input.value);
  }
}

export interface UseChildrenReturn<I> {
  inputs: Readonly<ShallowRef<ReadonlyArray<I>>>;
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
    inputs: context.inputs,
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
