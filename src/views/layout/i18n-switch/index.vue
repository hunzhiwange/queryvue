<template>
  <DropdownItem @click="handleSelect">
    <Icon type="md-globe"></Icon>
    {{ __('国际化') }}
    <Modal v-model="i18nSelect" width="360" class="i18n-theme-select">
      <Row type="flex" justify="center" align="middle">
        <RadioGroup v-model="i18n" @on-change="setIi8n()">
          <Radio
            v-for="(item, index) in i18nList"
            :key="index"
            :label="item.name"
          >
            <span>{{ item.title }}</span>
          </Radio>
        </RadioGroup>
      </Row>
      <template #footer></template>
    </Modal>
  </DropdownItem>
</template>

<script src="./assets/index.js" lang="tsx"></script>
