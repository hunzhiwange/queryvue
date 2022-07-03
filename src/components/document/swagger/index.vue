<template>
    <div class="swagger-content">
        <iframe ref="currentSwgger" class="swagger-iframe" :src="url"></iframe>
        <div v-if="loading" class="swagger-loading"><Button type="primary" loading>加载中...</Button></div>
    </div>
</template>

<style lang="less" scoped>
    .swagger-content {
        position: absolute;
        top: 61px;
        left: 0;
        width: 100%;
        height: calc(100% - 84px);
        .swagger-iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 0 0;
            border: 0;
            float: none;
            margin: -1px 0 0;
            max-width: none;
            outline: 0;
            padding: 0;
        }
        .swagger-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>

<script>
import { setTimeout } from 'timers';

    export default {
        name: "Swagger",
        props: {
            value: {
                type: ''
            },
            title: {
                type: ''
            },
            isUrl: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                loading: true,
                swgger: null,
                //url: 'http://localhost:5000/?dev=1'+(this.readOnly ? '&lightbox=1' : ''),
                url: window.location.origin + '/swagger/index.html',
            }
        },
        mounted() {
            window.addEventListener('message', this.handleMessage)
            this.swgger = this.$refs.currentSwgger.contentWindow;
        },
        activated() {
            // window.addEventListener('message', this.handleMessage)
            // this.swgger = this.$refs.currentSwgger.contentWindow;
        },
        methods: {
            handleMessage (event) {
                const data = event.data;
                switch (data.act) {
                    case 'ready':
                        this.swgger.postMessage({
                            act: 'setData',
                            params: {
                                type: this.isUrl ? 'url' : 'content',
                                data: this.value,
                            }
                        }, '*')
                        setTimeout(() => this.loading = false, 300)
                        break

                    case 'change':
                        if (this.loading) {
                            return
                        }
                        this.$emit('saveData', data.params)
                        break
                }
            },
        },
    }
</script>
