<template>
    <el-table
        :data="tableData6"
        border
        align=" center"
        :summary-method="getSummaries"
        show-summary
        className='table-box'
        style="width: 100%">
        <el-table-column label="统计">
            <el-table-column
                prop="name"
                label="年龄段">
            </el-table-column>
        </el-table-column>
        <el-table-column label="合计">
            <el-table-column
                prop="number1"
                label="人数">
            </el-table-column>
            <el-table-column
                prop="percentage1"
                label="百分比">
            </el-table-column>
        </el-table-column>
        <el-table-column label="男性">
            <el-table-column
                prop="number2"
                label="人数">
            </el-table-column>
            <el-table-column
                prop="percentage2"
                label="百分比">
            </el-table-column>
        </el-table-column>
        <el-table-column label="女性">
            <el-table-column
                prop="number3"
                label="人数">
            </el-table-column>
            <el-table-column
                prop="percentage3"
                label="百分比">
            </el-table-column>
        </el-table-column>
    </el-table>
</template>
<script>
  export default {
    data() {
      return {
        tableData6: [{
          name: '<25',
          number1: 5,
          number2: 6,
          number3: 10,
          percentage1: '10%',
          percentage2: '20%',
          percentage3: '30%'
        }, {
          name: '25-29',
          number1: 5,
          number2: 6,
          number3: 10,
          percentage1: '15%',
          percentage2: '14%',
          percentage3: '18%'
        }]
      };
    },
    mounted () {

    },
    methods: {
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                const values1 = data.map(item => String(item[column.property]));
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
                } else if (values1.every(value => isNaN(value))) {
                    sums[index] = values1.reduce((prev, curr) => {
                        const value = String(curr)
                        if (!isNaN(value)) {
                            return prev
                        } else {
                            return prev + parseInt(curr.split('%')[0])
                        }
                    }, 0)
                    sums[index] += ' %';
                }
            });
            return sums;
        }
    }
  };
</script>
<style lang="less" scoped>
    .is-group{
        .has-gutter{
            .el-table th{
                text-align: center;
            }
        }
    }
</style>

