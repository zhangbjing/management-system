<template>
    <div class="box">
        <p class="title">体检人次统计分布>体检人次统计</p>
        <div class="head">
            <div class="head-top"><p>体检人次统计</p></div>
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
                        end-placeholder="结束日期"             
                        :picker-options="pickerOptions2">
                    </el-date-picker>
                    <ul class="boo"><li>{{contentData}}</li></ul>
                </div>
                <el-select v-model="value2" @change="channelData" filterable placeholder="渠道">
                    <el-option
                        v-for="item in options"
                        :key="item.fName"
                        :label="item.fShortname"
                        :value="item.fId">
                    </el-option>
                </el-select>
            </div>
            <div class="main">
                <ul class="uls">
                    <li class="list" :class="sum == index ? 'on' : ''" v-for="(item, index) in title" :key='index' @click='lineData(index)'>{{item}}</li>
                </ul>
                <div class="echarts">
                    <Chart :options="polar" ref='chartVm'></Chart>
                    <p :style="flag == true ? 'display: block;' : 'display: none;'" class="too">暂无数据</p>
                </div>
            </div>
        </div>
        <div class="table-box">
            <div class="tip">
                <p>所有医院 近一周人数统计明细 ／{{Hospital}} {{startDate}} 至 {{endDate}} 人数统计明细</p>
            </div>
            <div class="table-main">
                <el-table
                    :data="tableData"
                    stripe
                    show-summary
                    :summary-method = 'getSummaries'
                    style="width: 100%;">
                    <el-table-column
                        prop="time"
                        sortable
                        align="center"
                        label="日期"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="guaHao"
                        label="体检人次">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="tiShiNeng"
                        label="体适能检测人次">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="tiChengFen"
                        label="体成份检测人次">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="xinFeiNaiLi"
                        label="心肺耐力检查人次">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="xinXueGuan"
                        label="心血管体测人次">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="wenJuan"
                        label="评估问卷">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="addData">
            <p @click='addData' :style="status === true ? 'display: block;' : 'display: none;'">加载更多</p>
            <p :style="all === true ? 'display: block;' : 'display: none;'" >已加载全部</p>
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
                type: 1,
                value1: [], // 选择时间
                value2: '', // 选择医院,
                Hospital: '', // 提示医院
                flag: false,
                status: false, // 点击加载更多
                all: false, // 提示加载完毕
                contentData: '最近一周',
                startSize: 0, // 起始位置
                pageSize: 20, // 点击加载的数据
                sum: 0,
                charData: [],
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                pickerOptions2: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        }, 
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }, 
                        {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            },
                        },
                        {
                            text: '最近六个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                                picker.$emit('pick', [start, end]);
                            },
                        }
                    ]
                },
                options: [],
                title: ['体检人次', '体适能检测人次', '体成份检测人次', '心肺耐力检查人次', '心血管体测人次',  '评估问卷'],
                polar: {
                    tooltip: {
                        trigger: 'axis'
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            show: false,
                            realtime: true,
                            start: 0,
                            end: 100
                        },
                        {
                            show: false
                        }
                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        splitLine: { // 是否显示刻度线
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#DEDEDE'
                            }
                        },
                        axisTick: { // 是否显示坐标轴刻度
                            show: false
                        },
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            showMinLabel: false //是否显示最小刻度
                        },
                        axisTick: { // 是否显示坐标轴刻度
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#DEDEDE'
                            }
                        },
                        splitLine: {
                            show: false,
                            // lineStyle: { // 分割线
                            //     type: 'dashed'
                            // }
                        }
                    },
                    series: []
                },
                tableData: [],
                clickTableData: []
            };
        },
        mounted () {
            this.Hospital = '所有医院'
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.value1.push(start)
            this.value1.push(end)
            this.timeData(this.value1)
            // 根据时间/渠道/类型查询统计人数
            $.ajax({
                type: "get",
                url: localhost + "backstage/statistics/peopleCount",
                dataType: "json",
                data: {
                    type: this.type,
                    time: this.startDate + 'x' + this.endDate,
                    channelId: this.value2
                },
                xhrFields:{withCredentials:true},
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Login_Authorization': localStorage.getItem('token'),
                    'User_Id': localStorage.getItem('id')
                },
                success: (data) => {
                    if (data.code === '200') {
                        this.charData = data.data.results
                    }
                }
            });
            // 获取所有渠道
            $.ajax({
                type: "get",
                url: localhost + "backstage/statistics/allChannels",
                dataType: "json",
                data: {},
                headers: {
                    'Login_Authorization': localStorage.getItem('token'),
                    'User_Id': localStorage.getItem('id')
                },
                xhrFields:{withCredentials:true},
                success: (data) => {
                    // console.log(data)
                    let code = data.code
                    if (code === '200') {
                        this.options = data.data
                    }
                }
            });
            // 根据时间，页码返回所有类型的统计人数，第一页数据包含总计，其他的页码不包含总计
            $.ajax({
                type: 'get',
                url: localhost + 'backstage/statistics/allTypes',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Login_Authorization': localStorage.getItem('token'),
                    'User_Id': localStorage.getItem('id')
                },
                xhrFields:{withCredentials:true},
                data: {
                   time: this.startDate + 'x' + this.endDate, 
                },
                success: (data) => {
                    if (data.code === '200') {
                        if (data.data.typeCounts.length > this.pageSize) {
                            this.status = true
                            this.clickTableData = data.data.typeCounts
                            this.tableData = this.clickTableData.slice(this.startSize, this.pageSize)
                        } else {
                            this.status = false
                            this.tableData = data.data.typeCounts
                        }
                        
                    }
                }
            })
        },
        watch: {
            charData (value) {
                let seriesData = []
                let xAxisData = []
                if(value.length > 0){
                    this.flag = false
                    value.forEach((item) => {
                        seriesData.push(item.peopleCount)
                        xAxisData.push(item.time)
                    })
                    this.polar.xAxis.data = xAxisData
                    this.polar.series = [
                        {
                            data: seriesData,
                            type: 'line',
                            itemStyle : {  
                                normal : { 
                                    color:'#02B3ED'
                                }  
                            }
                        }
                    ]
                    this.$refs.chartVm.setOption(this.polar)
                } else{
                    this.flag = true
                    this.polar.xAxis.data = []
                    this.polar.series = [
                        {
                            data: [],
                            type: 'line'
                        }
                    ]
                    this.$refs.chartVm.setOption(this.polar)
                }
            }
        },
        methods: {
            startTime () {
                this.timeData(this.value1)
                this.ajaxData()
                let Millisecond = this.value1[1]-this.value1[0]
                if(Millisecond /(1000 * 60 * 60 * 24) == '7'){
                    this.contentData = '最近一周'
                } else if (Millisecond /(1000 * 60 * 60 * 24) == '30') {
                    this.contentData = '最近一个月'
                } else if (Millisecond /(1000 * 60 * 60 * 24) == '90') {
                    this.contentData = '最近三个月'
                } else if (Millisecond /(1000 * 60 * 60 * 24) == '180') {
                    this.contentData = '最近六个月'
                } else {
                    this.contentData = Millisecond / (1000 * 60 * 60 * 24) + '天内的数据'
                }
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
                this.ajaxData()
            },
            lineData (index) { // change时间
                this.sum = index
                this.type = index + 1
                this.ajaxData()
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
                    sums[index] += ' 人';
                } else {
                    sums[index] = 'N/A';
                }
                });

                return sums;
            },
            ajaxData (){
                $.ajax({
                    type: "get",
                    url: localhost + "backstage/statistics/peopleCount",
                    dataType: "json",
                    data: {
                        type: this.type,
                        time: this.startDate + 'x' + this.endDate,
                        channelId: this.value2
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Login_Authorization': localStorage.getItem('token'),
                        'User_Id': localStorage.getItem('id')
                    },
                    xhrFields:{withCredentials:true},
                    success: (data) => {
                        if (data.code === '200') {
                            this.charData = data.data.results
                        }
                    }
                });
                // 根据时间，页码返回所有类型的统计人数，第一页数据包含总计，其他的页码不包含总计
                $.ajax({
                    type: 'get',
                    url: localhost + 'backstage/statistics/allTypes',
                    dataType: 'json',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Login_Authorization': localStorage.getItem('token'),
                        'User_Id': localStorage.getItem('id')
                    },
                    xhrFields:{withCredentials:true},
                    data: {
                        time: this.startDate + 'x' + this.endDate,
                        channelId: this.value2
                    },
                    success: (data) => {
                        if (data.code === '200') {
                            if (data.data.typeCounts.length > this.pageSize) {
                                this.status = true
                                this.clickTableData = data.data.typeCounts
                                this.tableData = this.clickTableData.slice(this.startSize, this.pageSize)
                            } else {
                                this.status = false
                                this.tableData = data.data.typeCounts
                            }
                        }
                    }
                })
            },
            addData () {
                this.tableData = this.clickTableData.slice(this.startSize, this.pageSize += this.pageSize)
                if (this.tableData.length === this.clickTableData.length) {
                    this.all = true
                    this.status = false
                } else {
                    this.all = false
                }
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
            }
        }
    }
</script>
<style lang="less" scoped>
    .box{
        padding: 30px;
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
            justify-content: space-between;
            .element-ui{
                display: -webkit-flex;
                align-items: center;
                margin-left: 50px;
                .boo{
                    font-size: 14px;
                    color: rgb(102, 102, 102);
                    margin-left: 30px;
                    counter-reset: count;
                    li:before{
                        content: '●';
                        color: #02B3ED;
                        padding-right: 5px;
                    }
                }
                .el-date-editor{
                    width: 300px;
                    .el-input__inner{
                        width: 300px;
                        height: 30px;
                        line-height: 30px;
                    }
                }
                .el-range-editor.el-input__inner{
                    padding: 0 10px;
                }
                .el-input__inner{
                    width: 270px;
                    height: 30px;
                    line-height: 30px;
                }
                .el-select{
                    width: 180px;
                    .el-input .el-input--suffix .is-focus{
                        width: 180px;
                        .el-input__inner{
                            width: 180px;
                            height: 30px;
                            line-height: 30px;
                        }
                    }
                }
            }
            .el-select{
                width: 180px;
                margin-right: 50px;
                .el-input__inner{
                    width: 180px;
                    height: 30px;
                    line-height: 30px;
                }
            }
        }
    }
    .main{
        .uls{
            height: 50px;
            display: -webkit-flex;
            background-color: rgb(247, 247, 247);
            border-bottom: 1px solid rgb(221, 221, 221);
            .list{
                width: 160px;
                height: 50px;
                font-size: 16px;
                color: rgb(102, 102, 102);
                border-right: 1px solid rgb(221, 221, 221);
                display: -webkit-flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
            .on{
                color: #02B3ED;
                background: #ffffff;
                border-top: 2px solid #02B3ED;
                border-right: none;
                border-left: none;
            }
        }
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
        margin-top: 30px;
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
                font-size: 17px;
                color:  rgb(51, 51, 51);
                border-left: 3px solid #02B3ED;
                margin-left: 20px;
                padding-left: 10px;
            }
        }
        .table-main{
            padding: 20px;
            .el-table{
                .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td{
                    color: #f00!important;
                }
            }
        }
    }
    .addData{
        width: 100%;
        height: 50px;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        p{
            width: 100px;
            height: 50px;
            font-size: 18px;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            &:nth-child(1){
                color: rgb(2, 179, 237);
            }
            &:nth-child(2){
                color: rgb(102, 102, 102);
            }
        }
    }
</style>
