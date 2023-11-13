<template>
  <board_header
    ref="board_header"
    :project="project"
    active-name="release"
  ></board_header>
  <div class="project-navigation2">
    <Row :gutter="16">
      <Col
        span="6"
        v-for="item in releaseData.data"
        :key="item.id"
        class="m-t-15"
      >
        <Card :bordered="false" shadow class="version-item">
          <template #title>
            {{ item.name }}
            <Icon
              type="ios-create-outline"
              @click.native="editTaskReleases(item.id)"
            />
          </template>
          <template #extra>
            <a href="javascript:void(0);">
              <Icon type="ios-loop-strong"></Icon>
              <Dropdown>
                <a href="javascript:void(0)">
                  <Badge
                    :status="getStatus(item.completed)"
                    :text="item.completed_enum"
                  />
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <template #list>
                  <DropdownMenu>
                    <DropdownItem
                      v-for="value in projectReleaseCompleted"
                      :key="value.value"
                      :name="value.value"
                      @click.native="
                        updateCompleted(
                          item.id,
                          value.value,
                          value.value == item.completed,
                        )
                      "
                      :selected="value.value == item.completed"
                    >
                      {{ value.msg }}
                    </DropdownItem>
                  </DropdownMenu>
                </template>
              </Dropdown>
            </a>
          </template>
          <p><Progress :percent="item.progress / 100" /></p>
          <p>
            <Divider orientation="right" size="small">
              <em style="color: #c5c8ce; font-weight: normal; font-size: 13px">
                预计发布时间： {{ item.create_at }}
              </em>
            </Divider>
          </p>
        </Card>
      </Col>
      <Col span="6" class="m-t-15">
        <Card
          :bordered="false"
          shadow
          class="version-item version-create"
          style="height: 141px"
        >
          <a @click="createRelease">
            <div style="text-align: center">
              <Icon type="md-add" />
              <div>创建版本</div>
            </div>
          </a>
        </Card>
      </Col>
    </Row>
  </div>
  <div class="fixed-footer">
    <Row justify="end">
      <i-col span="8">&nbsp;</i-col>
      <i-col span="16" class-name="fr">
        <Page
          class="fr"
          :total="releaseData.total"
          :current="releaseData.page"
          :page-size="releaseData.pageSize"
          show-sizer
          @on-change="changePage"
          @on-page-size-change="changePageSize"
        ></Page>
      </i-col>
    </Row>
  </div>
</template>

<script src="./assets/release.js" lang="tsx"></script>
<style lang="less" src="./assets/release.less"></style>
