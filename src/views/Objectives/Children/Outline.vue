<template>
    <div class="box">
        <p class="title">管理目标统计分布 > 管理目标分布概述</p>
        <div class="head">
            <div class="head-top"><p>管理目标分布概述</p></div>
            <div class="block">
                <div class="element-ui">
                    <el-date-picker
                        v-model="value1"
                        type="daterange"
                        align="right"
                        unlink-panels
                        @change="startTime"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" >
                    </el-date-picker>
                    <el-select v-model="value2" ref="selectVal" @change="channelData" filterable placeholder="渠道">
                        <el-option
                            v-for="item in options"
                            :key="item.fName"
                            :label="item.fShortname"
                            :value="item.fId">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="main">
                <div class="echarts">
                    <Chart :style="flag == false ? 'display: block;' : 'display: none;'" :options="polar" ref='chartVm'></Chart>
                    <p :style="flag == true ? 'display: block;' : 'display: none;'" class="too">暂无数据</p>
                </div>
            </div>
        </div>
        <div class="table-box">
            <div class="tip">
                <p>所有医院 近一周人数统计明细 ／{{Hospital}} {{startDate}} 至 {{endDate}} 人数统计明细</p>
            </div>
            <div class="table-main">
                <div class="table-left">
                    <p>管理目标</p>
                    <ul class="uls">
                        <li v-for="(item, index) in data" :key="index">{{item}}</li>
                    </ul>
                    <b>合计</b>
                </div>
                <div class="table-left">
                    <p>人数</p>
                    <ul class="uls">
                        <li v-for="(item, index) in tableData" :key="index">{{item}}</li>
                    </ul>
                    <b>{{sum}}</b>
                </div>
                <div class="table-left">
                    <p>占比</p>
                    <ul class="uls">
                        <li v-for="(item, index) in percentage" :key="index">{{item}}</li>
                    </ul>
                    <b></b>
                </div>
                <!-- <el-table
                    stripe
                    show-summary
                    :summary-method = 'getSummaries'
                    style="width: 100%;">
                    <el-table-column
                        align="center"
                        prop="time"
                        label="管理目标"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="guaHao"
                        label="人数"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="tiShiNeng"
                        label="占比"
                        width="180">
                    </el-table-column>
                </el-table>   -->
            </div>
        </div>
    </div>
</template>
<script>
    import Chart from '../../../components/Charts/Charts.vue'
    import localhost from '../../../util/localhost'
    import hex_md5 from 'js-md5'
    import $ from 'jQuery'
    export default {
        name: 'attribute',
        components: {
            Chart
        },
        data () {
            return {
                value1: [], // 选择时间
                value2: '', // 选择医院
                Hospital: '', // 提示医院
                flag: false,
                charData: [],
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                sum: 0,
                data:['健康促进','代谢综合征','高血压','糖尿病','肥胖', '血脂异常', '慢阻肺'],
                options: [],
                polar: {
                    // title: {
                    //     text: '管理目标分布图',
                    //     top: '50%',
                    //     left: '45%',
                    //     textStyle: {
                    //         fontWeight: 'normal',
                    //         fontSize: 16
                    //     }
                    // },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        top: '40%',
                        right: '10%',
                        data:['健康促进','代谢综合征','高血压','糖尿病','肥胖', '血脂异常', '慢阻肺']
                    },
                    series: []
                },
                tableData: [],
                percentage: []
            };
        },
        mounted () {
            this.Hospital = '所有医院'
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            this.value1.push(start)
            this.value1.push(end)
            this.timeData(this.value1)
            // 获取所有渠道
            $.ajax({
                type: "get",
                url: localhost + "backstage/statistics/allChannels",
                dataType: "json",
                headers: {
                    'Login_Authorization': localStorage.getItem('token'),
                    'User_Id': localStorage.getItem('id')
                },
                xhrFields:{withCredentials:true},
                data: {},
                success: (data) => {
                    let code = data.code
                    if (code === '200') {
                        this.options = data.data
                    }
                }
            });
            // 根据不同类型和时间获取分布
            this.changeTime()
        },
        watch: {
            charData (value) {
                this.seriesData = []
                for(let i in value) {
                    this.seriesData.push(value[i])
                }
                if (this.seriesData.length <= 0) {
                    this.flag = true
                } else {
                    this.flag = false
                    this.polar.series = [
                        {
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            tooltip : {
                                trigger: 'item',
                                formatter: "{b} : {c}人 ({d}%)"
                            },
                            label: {
                                show: true
                            },
                            labelLine: {
                                show: true
                            },
                            data:[
                                {value:this.seriesData[0], name:'健康促进'},
                                {value:this.seriesData[1], name:'代谢综合征'},
                                {value:this.seriesData[2], name:'高血压'},
                                {value:this.seriesData[3], name:'糖尿病'},
                                {value:this.seriesData[4], name:'肥胖'},
                                {value:this.seriesData[5], name:'血脂异常'},
                                {value:this.seriesData[6], name:'慢阻肺'}
                            ]
                        }
                    ]
                    this.$refs.chartVm.setOption(this.polar)
                }
                
            }
        },
        methods: {
            startTime () { // change时间
                this.timeData(this.value1)
                this.changeTime()
            },
            channelData () { // change医院渠道
                if(this.value2 == '0000') {
                    this.Hospital = "动亮健康"
                } else if (this.value2 == '0001') {
                    this.Hospital = "北京301医院"
                } else if (this.value2 == '0002') {
                    this.Hospital = "北京西苑医院"
                } else if (this.value2 == '0003') {
                    this.Hospital = "枣庄妇幼保健院"
                } else if (this.value2 == '0004') {
                    this.Hospital = "睢县中医院"
                } else if (this.value2 == '0005') {
                    this.Hospital = "珠江医院"
                }
                this.changeTime()
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                    }, 0);
                    sums[index] += '';
                } else {
                    sums[index] = 'N/A';
                }
                });

                return sums;
            },
            timeData (time){
                let newDate1 = new Date(time[0]);
                let newDate2 = new Date(time[1]);
                // 开始时间
                let Month = newDate1.getMonth() + 1
                let Data = newDate1.getDate()
                if (Month < 10) {
                    Month =  '0' + Month
                }
                if (Data < 10) {
                    Data =  '0' + Data
                }
                this.startDate = newDate1.getFullYear() + '-' + Month + '-' + Data
                // 结束时间
                let Month2 = newDate2.getMonth() + 1
                let Data2 = newDate2.getDate()
                if (Month2 < 10) {
                    Month2 =  '0' + Month2
                }
                if (Data2 < 10) {
                    Data2 =  '0' + Data2
                }
                this.endDate = newDate2.getFullYear() + '-' + Month2 + '-' + Data2
            },
            changeTime () {
                this.tableData = []
                this.percentage = []
                this.sum = 0
                $.ajax({
                    type: "get",
                    url: localhost + "backstage/statistics/distribute/4",
                    dataType: "json",
                    data: {
                        time: this.startDate + 'x' + this.endDate,
                        channelId: this.value2
                    },
                    xhrFields:{withCredentials:true},
                    headers: {
                        'Login_Authorization': localStorage.getItem('token'),
                        'User_Id': localStorage.getItem('id')
                    },
                    success: (data) => {
                        let code = data.code
                        if (code === '200') {
                            this.charData = data.data
                            for(let key in data.data) {
                                this.tableData.push(data.data[key])
                                this.sum += data.data[key]
                            }
                            this.tableData.map(item => {
                                if(item == 0) {
                                    this.percentage.push('0.00%')
                                } else {
                                    this.percentage.push((item/ this.sum).toFixed(2) + '%')
                                }
                            })
                        }
                    }
                });
            }
        }
    }
</script>
<style lang="less" scoped>
.box{
    margin: 30px;
}
    .title{
        margin-bottom: 20px;
        font-size: 14px;
        color: rgb(102, 102, 102)
    }
    .head{
        background-color: #ffffff;
        border-radius: 10px;
        display: -webkit-flex;
        flex-direction: column;
        .head-top{
            display: -webkit-flex;
            align-items: center;
            border-bottom: 1px solid #eeeeee;
            p{
                margin-top: 10px;
                margin-bottom: 10px;
                width: 100%;
                height: 25px;
                line-height: 25px;
                font-style: 17px;
                color: rgb(51, 51, 51);
                border-left: 3px solid #02B3ED;
                margin-left: 20px;
                padding-left: 10px;
            }
        }
        .block{
            height: 50px;
            display: -webkit-flex;
            align-items: center;
            justify-content: flex-end;
            .element-ui{
                width: 700px;
                display: -webkit-flex;
                align-items: center;
                justify-content: space-around;
                .el-date-editor{
                    width: 300px;
                    .el-input__inner{
                        width: 300px;
                        height: 30px;
                        line-height: 30px;
                    }
                }
                // .el-range-editor.el-input__inner{
                //     padding: 0 10px;
                // }
                // .el-input__inner{
                //     width: 270px;
                //     height: 30px;
                //     line-height: 30px;
                // }
                .el-select{
                    width: 150px;
                }
            }
        }
    }
    .main{
        .echarts{
            height: 500px;
            position: relative;
            .too{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: #cccccc;
            }
        }
    }
    .table-box{
        margin-top: 20px;
        background-color: #fff;
        border-radius: 10px;
        .tip{
            height: 50px;
            display: -webkit-flex;
            align-items: center;
            border-bottom: 1px solid #eeeeee;
            p{
                width: 100%;
                height: 25px;
                line-height: 25px;
                border-left: 3px solid #02B3ED;
                margin-left: 20px;
                padding-left: 10px;
            }
        }
        .table-main{
            padding: 20px;
            display: -webkit-flex;
            flex-direction: row;
            .table-left{
                width: 240px;
                display: -webkit-flex;
                flex-direction: column;
                p, b{
                    width: 100%;
                    height: 60px;
                    display: -webkit-flex;
                    justify-content: center;
                    align-items: center;
                    color: #0CB5ED;
                }
                p{
                    background: #EEEEEE;
                }
                b{
                    background: #F7F7F7
                }
                .uls{
                    li{
                       width: 100%;
                        height: 60px;
                        display: -webkit-flex;
                        justify-content: center;
                        align-items: center;
                        &:nth-child(even){
                            background: #F7F7F7;
                        }
                    }
                }
            }
        }
    }
    
</style>
