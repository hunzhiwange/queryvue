<template>
  <component :is="minContent ? 'div' : 'Card'" :bordered="false" shadow>
    <ButtonGroup>
      <Button @click="zoomIn">
        <Icon type="md-add" />
        放大
      </Button>
      <Button @click="zoomOut">
        <Icon type="md-remove" />
        缩小
      </Button>
      <Button @click="fit">
        <Icon type="md-contract" />
        自适应
      </Button>
      <Button @click="downloadAsSvg">
        <Icon type="md-arrow-down" />
        下载为 SVG
      </Button>
      <Button @click="downloadAsPng">
        <Icon type="md-images" />
        下载为 PNG
      </Button>
    </ButtonGroup>
    <span class="m-l-10">
      宽度
      <InputNumber
        class="m-l-10"
        :precision="0"
        :min="0"
        :max="500"
        :step="50"
        v-model="tempWidthMindMap"
        style="width: 65px"
        @on-change="changeCurrentWidthMindMap"
      ></InputNumber>
      %
    </span>

    <span class="m-l-10">
      高度
      <InputNumber
        :precision="0"
        :min="0"
        :max="30000"
        :step="1000"
        v-model="tempHeightMindMap"
        style="width: 80px"
        @on-change="changeCurrentHeightMindMap"
      ></InputNumber>
      px
    </span>

    <ColorPicker
      class="m-l-10"
      v-model="optionsMindMap.color"
      alpha
      recommend
      @on-change="mindMap"
    ></ColorPicker>

    <Select
      class="m-l-10"
      v-model="currentLevelMindMap"
      prefix="md-menu"
      style="width: 80px"
      @on-change="mindMap"
    >
      <Option
        v-for="item in levelMindMap"
        :value="item.value"
        :key="item.value"
      >
        {{ item.label }}
      </Option>
    </Select>

    <div class="svg_box">
      <svg
        id="markmap"
        xmlns="http://www.w3.org/2000/svg"
        class="w-screen h-screen leading-none markmap mm-cowe6a-1"
        :style="{
          width: currentWidthMindMap + '%',
          height: currentHeightMindMap + 'px',
        }"
      ></svg>
    </div>
  </component>
</template>

<script src="./assets/content-view.js" lang="tsx"></script>
<style lang="less" src="./assets/content_view.less"></style>
