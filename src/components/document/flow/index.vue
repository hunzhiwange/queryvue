<template>
    <div class="flow-content">
        <iframe ref="myFlow" class="flow-iframe" :src="url"></iframe>
        <div v-if="loadIng" class="flow-loading"><w-loading></w-loading></div>
    </div>
</template>

<style lang="less" scoped>
    .flow-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
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
                loadIng: true,
                flow: null,
                url: 'http://localhost:3000/?dev=1&edit=1',
                url2: window.location.origin + '/js/grapheditor/' + (this.readOnly ? 'viewer' : 'index') + '.html',
            }
        },
        mounted() {
            window.addEventListener('message', this.handleMessage)
            this.flow = this.$refs.myFlow.contentWindow;
        },
        activated() {
            window.addEventListener('message', this.handleMessage)
            this.flow = this.$refs.myFlow.contentWindow;
        },
        methods: {
            handleMessage (event) {
                const data = event.data;
                switch (data.act) {
                    case 'ready':
                        //this.loadIng = false;
                        this.flow.postMessage({
                            act: 'setData',
                            params: {
                                title: this.title,
                                data: this.value,
                            }
                        }, '*')
                        break

                    case 'change':
                        this.$emit('input', data.params.data)
                        this.$emit('saveData')
                        break

                    case 'save':
                        this.$emit('saveData');
                        break

                    case 'imageContent':
                        let pdf = new JSPDF({
                            format: [data.params.width, data.params.height]
                        });
                        pdf.addImage(data.params.content, 'PNG', 0, 0, 0, 0);
                        pdf.save(`${data.params.name}.pdf`);
                        break
                }
            },

            exportPNG(name, scale = 10) {
                this.flow.postMessage({
                    act: 'exportPNG',
                    params: {
                        name: name || this.$L('无标题'),
                        scale: scale,
                        type: 'png',
                    }
                }, '*')
            },

            exportPDF(name, scale = 10) {
                this.flow.postMessage({
                    act: 'exportPNG',
                    params: {
                        name: name || this.$L('无标题'),
                        scale: scale,
                        type: 'imageContent',
                    }
                }, '*')
            }
        },
    }
</script>
