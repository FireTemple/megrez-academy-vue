<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{userInfo.firstName}}</div>
                            <div>parent</div>
                        </div>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>Notification</span>
                    </div>
                    <p>{{publicNotification}}</p>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{studentList.length}}</div>
                                    <div>You kids</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-notebook-1 grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{courseNumber}}</div>
                                    <div>All Courses you have taken</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>Recent news</span>
                    </div>
                    <el-table :data="notices" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <el-table-column width="40">
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">
                                    {{scope.row.title}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-select v-model="selectStudent" placeholder="Student" class="handle-select mr10">
                    <el-option key="0" label="" value=""></el-option>
                    <el-option key="1" label="F2020" value="F2020"></el-option>
                    <el-option key="2" label="W2020" value="W2020"></el-option>
                    <el-option key="3" label="F2021" value="F2021"></el-option>
                    <el-option key="4" label="W2021" value="W2021"></el-option>
                    <el-option key="5" label="S2021" value="S2021"></el-option>
                </el-select>

            </el-col>
            <el-col :span="4">
                <el-select v-model="selectCourse" placeholder="Course" class="handle-select mr10">
                    <el-option key="0" label="" value=""></el-option>
                    <el-option key="1" label="F2020" value="F2020"></el-option>
                    <el-option key="2" label="W2020" value="W2020"></el-option>
                    <el-option key="3" label="F2021" value="F2021"></el-option>
                    <el-option key="4" label="W2021" value="W2021"></el-option>
                    <el-option key="5" label="S2021" value="S2021"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :data="data" type="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :data="data" type="line"
                            :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../../components/common/bus';

    export default {
        name: 'dashboard',
        data() {
            return {

                /**
                 * user information
                 */

                userInfo: {},

                /**
                 * notification
                 */
                publicNotification: 'This project is in the testing stage, if you find any errors, please contact the author.',

                studentList:[],

                courseNumber:'41',

                name: localStorage.getItem('ms_username'),
                selectCourse:'',
                selectStudent:'',

                notices: [
                    {
                    title: 'The first results of the machine learning course have been announced',
                    status: false,
                },
                    {
                        title: 'More features will be online soon',
                        status: false,
                    },
                    {
                        title: 'More features will be online soon',
                        status: false,
                    }, {
                        title: 'More courses will be added in the next semester',
                        status: false,
                    },
                ],
                data: [
                    {
                    name: '2020/09/04',
                    value: 95
                    },
                    {
                        name: '2020/09/05',
                        value: 89
                    },
                    {
                        name: '2020/09/06',
                        value: 77
                    },
                    {
                        name: '2020/09/07',
                        value: 98
                    },
                    {
                        name: '2020/09/08',
                        value: 76
                    },
                    {
                        name: '2020/09/09',
                        value: 98
                    },
                    {
                        name: '2020/09/10',
                        value: 65
                    }
                ],
                options: {
                    title: 'Scores of machine learning',
                    showValue: false,
                    fillColor: 'rgb(45, 140, 240)',
                    bottomPadding: 30,
                    topPadding: 30
                },
                options2: {
                    title: 'Scores of machine learning',
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD',
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                }
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? 'administrator' : 'parent';
            },
        },
        created() {
            this.getUserInfo();
            this.handleListener();
            this.changeDate();
        },
        activated() {
            this.handleListener();
        },
        deactivated() {
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            changeDate() {
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
                })
            },
            handleListener() {
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg) {
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart() {
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            },
            getUserInfo() {
                let userId = localStorage.getItem("userId");
                this.$axios({
                    method: 'get',
                    url: '/api/user/' + userId
                }).then(res => {
                    this.userInfo = res.data;
                }).catch(error => {
                    this.$message.error("loading info failed");
                    console.log(error);
                })
            },

        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
