// import {
//   type ComponentInternalInstance,
//   isVNode,
//   type SlotsType,
//   type VNode,
//   type VNodeChild,
// } from "vue";
//
// function nextVNode(queue: VNodeChild & Array<unknown>): VNode | null {
//   while (queue.length) {
//     const vnode = queue.shift();
//
//     if (isVNode(vnode)) {
//       return vnode;
//     }
//
//     if (Array.isArray(vnode)) {
//       queue.unshift(...vnode);
//     }
//   }
//
//   return null;
// }
//
// function* walkChildren(
//   child: VNodeChild,
// ): Generator<ComponentInternalInstance> {
//   const queue = Array.isArray(child) ? [...child] : [child];
//   while (queue.length) {
//     const vnode = queue.shift();
//
//     if (vnode === null) {
//       break;
//     }
//
//     if (Array.isArray(vnode)) {
//       queue.unshift(...vnode);
//       continue;
//     }
//
//     if (isVNode(vnode)) {
//       if (vnode.component) {
//         yield vnode.component;
//
//         queue.unshift(vnode.component.subTree);
//       } else if (Array.isArray(vnode.children)) {
//         queue.unshift(...vnode.children);
//       }
//     }
//   }
// }
//
// const Logger = defineComponent(
//   (props: { name: string; count: number }, { slots }) => {
//     const vm = getCurrentInstance();
//     if (import.meta.client) {
//       const trigger = shallowRef(0);
//
//       watch(
//         trigger,
//         () => {
//           console.log(`${props.name} - ${props.count} watch pre`, vm!.uid);
//
//           if (props.name.toLowerCase() === "first" && props.count === 2) {
//             const start = performance.now();
//             for (const component of walkChildren(vm!.vnode)) {
//               console.log(
//                 component.type.__name ?? component.type.name,
//                 toRaw(component.props),
//               );
//             }
//             console.log("walkChildren", performance.now() - start);
//           }
//         },
//         { flush: "pre" },
//       );
//
//       watch(
//         trigger,
//         () => {
//           console.log(`${props.name} - ${props.count} watch post`, vm!.uid);
//         },
//         { flush: "post" },
//       );
//
//       onBeforeUpdate(() => {
//         console.log(`${props.name} - ${props.count} onBeforeUpdate`, vm!.uid);
//         triggerRef(trigger);
//         triggerRef(trigger);
//       });
//
//       onUpdated(() => {
//         console.log(`${props.name} - ${props.count} onUpdated`, vm!.uid);
//       });
//     }
//
//     return () => {
//       // console.log(`${props.name} - ${props.count} render`, vm!.uid);
//       return h(
//         "div",
//         { "data-count": props.count, "data-name": props.name },
//         props.count > 0
//           ? h(
//               Logger,
//               {
//                 name: props.name,
//                 count: props.count - 1,
//               },
//               slots.default,
//             )
//           : slots.default?.(),
//       );
//     };
//   },
//   {
//     name: "AppLogger",
//     props: ["name", "count"],
//     slots: {} as SlotsType<{
//       default: () => VNode;
//     }>,
//   },
// );
//
// export default Logger;
