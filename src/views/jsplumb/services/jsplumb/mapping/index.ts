import { jsPlumb } from 'jsplumb'



export default class DragMapping {


  constructor () {

  }

  mounted () {
    //https://github.com/jsplumb-demonstrations/scrollable-lists
    const instance = jsPlumb.getInstance();

    const config = {
      connector: "Straight",
      paintStyle: { strokeWidth: 3, stroke: "#ffa500", "dashstyle": "2 4" },
      // endpoint: ["Dot", { radius: 5 }],
      endpointStyle: { fill: "#ffa500" },
      container: "canvas",
      listStyle: {
        endpoint: ["Rectangle", { width: 30, height: 30 }]
      }
    }

    const targetDom = document.querySelector("#list-one-list")!,
      rightDom = document.querySelector("#list-two-list")!;

    // @ts-expect-error 2.x 实际有该api
    instance.manage("list1", document.querySelector("#list-one"));
    // @ts-expect-error 2.x 实际有该api
    instance.manage("list2", document.querySelector("#list-one"));

    instance.batch(function () {
      var sources = targetDom.querySelectorAll("li");
      for (var i = 0; i < sources.length; i++) {
        instance.makeSource(sources[i], {
          allowLoopback: false,
          anchor: ["Left", "Right"],
          ...config
        });
      }

      var targets = rightDom.querySelectorAll("li");
      for (var i = 0; i < targets.length; i++) {
        instance.makeTarget(targets[i], {
          anchor: ["Left", "Right"],
          ...config
        });
      }

      instance.connect({ source: sources[0], target: targets[0], ...config })
      instance.connect({ source: sources[1], target: targets[5], ...config })
      instance.connect({ source: sources[2], target: targets[12], ...config })

    })

    // @ts-expect-error 2.x 实际有该api
    instance.addList(targetDom, {
      endpoint: ["Rectangle", { width: 10, height: 10 }]
    })

    //  jtk-scrollable-list 无效，所需要需要加该api
    // @ts-expect-error 2.x 实际有该api
    instance.addList(rightDom, {
      endpoint: ["Rectangle", { width: 10, height: 10 }]
    })

    instance.bind("click", function (c) { instance.deleteConnection(c) })
  }
}