<template>
    <div>
        <el-card>
            <div class="echartdom" :style="{ width: width + 'px', height: height + 'px' }">
                
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        props: {
            width: {
                type: Number,
                default: 400
            },
            height: {
                type: Number,
                default: 300
            }
        }
    }
</script>

<style lang="scss" scoped>
.echartdom {
    margin: 0 auto;
}
</style>