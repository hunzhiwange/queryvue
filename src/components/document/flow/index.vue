<template>
    <div class="flow-content">
        <iframe ref="currentFlow" class="flow-iframe" :src="url" allow="clipboard-read; clipboard-write"></iframe>
        <div v-if="loading" class="flow-loading"><Button type="primary" loading>加载中...</Button></div>
    </div>
</template>

<style lang="less" scoped>
    .flow-content {
        position: absolute;
        top: 31px;
        left: 0;
        width: 100%;
        height: calc(100% - 10px);
        .flow-iframe {
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
        .flow-loading {
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
        name: "Flow",
        props: {
            value: {
                type: ''
            },
            title: {
                type: ''
            },
            readOnly: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                loading: true,
                flow: null,
                //url: 'http://localhost:5000/?dev=1'+(this.readOnly ? '&lightbox=1' : ''),
                url: window.location.origin + '/process/index.html' + (this.readOnly ? '?lightbox=1' : ''),
            }
        },
        mounted() {
            window.addEventListener('message', this.handleMessage)
            this.flow = this.$refs.currentFlow.contentWindow;
        },
        activated() {
            // window.addEventListener('message', this.handleMessage)
            // this.flow = this.$refs.currentFlow.contentWindow;
        },
        methods: {
            handleMessage (event) {
                const data = event.data;
                switch (data.act) {
                    case 'ready':
                        this.flow.postMessage({
                            act: 'setData',
                            params: {
                                title: this.title,
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
