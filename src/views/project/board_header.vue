<template>
    <div class="fixed-footer-offset2">
        <div class="project-navigation">
            <Menu mode="horizontal" theme2="light" :active-name="activeName">
                <Row>
                    <Col span="18">
                        <Submenu name="project">
                            <template slot="title">
                                <Icon type="md-git-branch" />
                                {{ project.name }}
                            </template>
                            <MenuItem :to="'/board/'+item.num" v-for="item in projects" :key="item.id" :name="'project-'+item.id">{{ item.name }}</MenuItem>
                        </Submenu>
                        <MenuItem v-if="issueNum !=''" name="issue" :to="'/board/issue/'+issueNum">
                            <Icon type="ios-document" />
                            {{ issueNum }}
                        </MenuItem>
                        <MenuItem name="index" :to="'/board/'+project.num">
                            <Icon type="md-list-box" />
                            任务
                        </MenuItem>
                        <MenuItem name="attachement" :to="'/board/'+project.num+'/attachement'">
                            <Icon type="md-document" />
                            文件
                        </MenuItem>
                        <MenuItem name="overview" :to="'/board/'+project.num+'/overview'">
                            <Icon type="md-globe" />
                            概览
                        </MenuItem>
                        <MenuItem name="release" :to="'/board/'+project.num+'/release'">
                            <Icon type="ios-happy" />
                            版本
                        </MenuItem>
                    </Col>
                    <Col span="6" >
                        <div class="pull-right">
                            <MenuItem name="11">
                                <Icon type="md-search" />
                                筛选
                            </MenuItem>
                            <MenuItem name="22">
                                <Icon type="ios-people" />
                                用户
                            </MenuItem>
                            <MenuItem name="33">
                                <Icon type="ios-construct" />
                                菜单
                            </MenuItem>
                        </div>
                    </Col>
                    </Row>
            </Menu>
        </div>
    </div>
</template>

<script type="text/javascript">
import http from '@/utils/http'

export default {
    data() {
        return {
            projects: [],
        }
    },
    props: {
        project: {},
        activeName: {
            type: String,
            default: '',
        },
        issueNum: {
            type: String,
            default: '',
        },
    },
    methods: {
        init: function(num, id) {
            this.apiGet('project', {status: 1}).then(res => {
                this.projects = res.data
            })
        },
    },
    mounted: function() {
        this.init()
    },
    mixins: [http],
}
</script>
