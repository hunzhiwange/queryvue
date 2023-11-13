<template>
  <DropdownItem @click="handleSelect">
    <Icon
      :style="{ verticalAlign: 'middle' }"
      type="ios-color-palette"
      size="22"
      color="#f04134"
    ></Icon>
    {{ __('主题') }}
    <Modal v-model="themeSelect" width="360" class="switch-theme-select">
      <Row type="flex" justify="center" align="middle">
        <i-col
          v-for="(item, index) in themeList"
          :key="index"
          :name="item.name"
          span="6"
          class="tx-c"
        >
          <div @click="setTheme(item.name)">
            <Tooltip :content="item.title" :placement="item.placement">
              <Avatar
                :style="{
                  'background-color': item.element,
                  color: item.menu,
                }"
                icon="ios-color-palette"
                class="pointer"
                @on-click="setTheme(item.name)"
              ></Avatar>
            </Tooltip>
          </div>
        </i-col>
      </Row>
    </Modal>
  </DropdownItem>
</template>

<script src="./assets/index.js" lang="tsx"></script>
