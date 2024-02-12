<template>
  <div class="page-bpmn">
    <div class="btn">
      <!--文件导入-->
      <div>
        <n-upload
          ref="upload"
          action=""
          :default-upload="false"
          :show-file-list="false"
          @change="handleOnchangeFile"
        >
          <n-button>Upload</n-button>
        </n-upload>
      </div>
      &nbsp;&nbsp;
      <!--保存-->
      <n-button type="primary">
        <a ref="saveDiagram">
          Save as BPMN
        </a>
      </n-button>
      &nbsp;&nbsp;
      <!--保存为SVG-->
      <n-button type="error">
        <a ref="saveSvg"> Save as SVG</a>
      </n-button>
    </div>
    <!--建模容器-->
    <div class="canvas" ref="canvas"></div>
    <div ref="jspropertiespanel" class="panel"></div>
  </div>
</template>

<script setup>
import { useMessage } from "naive-ui";
import { reactive, ref, onMounted } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js/dist/assets/diagram-js.css"; // 左边工具栏以及编辑节点的样式
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"; // 右边工具栏样式
import { xmlStr } from "./xmlStr";//初始化文件样式

let pageData = reactive({
  bpmnModeler: null
});
let canvas = ref(null);
let saveDiagram = ref(null);
let saveSvg = ref(null);
let jspropertiespanel = ref(null);

let init = () => {
  // 建模
  pageData.bpmnModeler = new BpmnModeler({
    container: canvas.value,
    //添加控制板
    propertiesPanel: {
      parent: jspropertiespanel.value
    },
    additionalModules: [
      // 左边工具栏以及节点
      propertiesProviderModule,
      // 右侧工具
      propertiesPanelModule
    ],
    moddleExtensions: {
      camunda: camundaModdleDescriptor
    }
  });
  createNewDiagram();
};
let createNewDiagram = () => {
  // 将字符串转换成图显示出来
  pageData.bpmnModeler.importXML(xmlStr, err => {
    if (err) {
      // console.error(err)
    } else {
      // 这里是成功之后的回调, 可以在这里做一系列事情
      success();
    }
    // 让图能自适应屏幕
    let canvas = pageData.bpmnModeler.get("canvas");
    canvas.zoom("fit-viewport");
  });
};
let success = () => {
  console.log("创建成功!");
  addBpmnListener();
  addModelerListener();
  addEventBusListener();
};
/**
 * 第一个执行函数
 */
// 添加绑定事件
let addBpmnListener = () => {
  // 获取a标签dom节点
  let downloadLink = saveDiagram.value;
  let downloadSvgLink = saveSvg.value;
  // 给图绑定事件，当图有发生改变就会触发这个事件
  pageData.bpmnModeler.on("commandStack.changed", function() {
    saveSVG(function(err, svg) {
      setEncoded(downloadSvgLink, "diagram.svg", err ? null : svg);
    });
    saveDiagrams(function(err, xml) {
      setEncoded(downloadLink, "diagram.bpmn", err ? null : xml);
    });
  });
};
// 下载为SVG格式,done是个函数，调用的时候传入的
let saveSVG = (done) => {
  // 把传入的done再传给bpmn原型的saveSVG函数调用
  pageData.bpmnModeler.saveSVG(done);
};
// 当图发生改变的时候会调用这个函数，这个data就是图的xml
let setEncoded = (link, name, data) => {
  // 把xml转换为URI，下载要用到的
  const encodedData = encodeURIComponent(data);
  // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
  //   console.log(link, name, data)
  // let xmlFile = new File([data], "test.bpmn");
  //   console.log(xmlFile)
  if (data) {
    // link.className = "active";
    link.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
    link.download = name;
  }
};
// 下载为bpmn格式,done是个函数，调用的时候传入的
let saveDiagrams = (done) => {
  // 把传入的done再传给bpmn原型的saveXML函数调用
  pageData.bpmnModeler.saveXML({ format: true }, function(err, xml) {
    done(err, xml);
  });
};
/**
 * 第二个执行函数
 */
let addModelerListener = () => {
  // 监听 modeler
  const bpmnjs = pageData.bpmnModeler;
  // 'shape.removed', 'connect.end', 'connect.move'
  const events = ["shape.added", "shape.move.end", "shape.removed"];
  events.forEach(function(event) {
    pageData.bpmnModeler.on(event, e => {
      let elementRegistry = bpmnjs.get("elementRegistry");
      console.log(e);
      let shape = e.element ? elementRegistry.get(e.element.id) : e.shape;

      console.log(shape)
      if (event === "shape.added") {
        console.log("新增了shape");
      } else if (event === "shape.move.end") {
        console.log("移动了shape");
      } else if (event === "shape.removed") {
        console.log("删除了shape");
      }
    });
  });
};
/**
 * 第三个监听函数
 */
let addEventBusListener = () => {
  // 监听 element
  const eventBus = pageData.bpmnModeler.get("eventBus");
  const modeling = pageData.bpmnModeler.get("modeling");
  const elementRegistry = pageData.bpmnModeler.get("elementRegistry");
  const eventTypes = ["element.click", "element.changed"];
  eventTypes.forEach(function(eventType) {
    eventBus.on(eventType, (e) => {
      if (!e || e.element.type == "bpmn:Process") return;
      if (eventType === "element.changed") {
        elementChanged(e);
      } else if (eventType === "element.click") {
        console.log("点击了element");
        let shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
        if (shape.type === "bpmn:StartEvent") {
          modeling.updateProperties(shape, {
            // name: "我是修改后的虚线节点",
            name: "I am the modified dotted node",
            isInterrupting: false,
            // customText: "我是自定义的text属性"
            customText: "I am a custom text attribute"
          });
          // modeling.setColor(shape, {
          //   fill: '#ff0000',
          //   stroke: null
          // })
        }
      }
    });
  });
};
let elementChanged = (e) => {
  let shape = getShape(e.element.id);
  console.log(shape);
  if (!shape) {
    // 若是shape为null则表示删除, 无论是shape还是connect删除都调用此处
    console.log("无效的shape");
    // 上面已经用 shape.removed 检测了shape的删除, 要是删除shape的话这里还会被再触发一次
    console.log("删除了shape和connect");
    return;
  }
  if (!isInvalid(shape.type)) {
    if (isSequenceFlow(shape.type)) {
      console.log("改变了线");
    }
  }
};
let getShape = (id) => {
  let elementRegistry = pageData.bpmnModeler.get("elementRegistry");
  return elementRegistry.get(id);
};
let isInvalid = (param) => {
  // 判断是否是无效的值
  return param === null || param === undefined || param === "";
};
let isSequenceFlow = (type) => {
  // 判断是否是线
  return type === "bpmn:SequenceFlow";
};
/**
 * 导入
 */
const handleOnchangeFile = (file) => {
  const reader = new FileReader();
  let data = "";
  reader.readAsText(file.file.file);
  reader.onload = (event) => {
    data = event.target.result;
    try {
      pageData.bpmnModeler.importXML(data)
      // let result = pageData.bpmnModeler.importXML(data);
      // let { warnings } = result;
      let canvas = pageData.bpmnModeler.get("canvas");
      canvas.zoom("fit-viewport");
      useMessage.success("Import succeeded！");
    } catch (err) {
      useMessage.error("Import failed. Check the file type！");
      console.log(err.message, err.warnings);
    }
  };
};
onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.page-bpmn {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .btn {
    display: flex;
    justify-content: flex-start;
  }

  .canvas {
    width: 100%;
    flex: 1;
  }

  .panel {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 300px;
  }
}
</style>
