<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>Courses Admin</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <el-select v-model="selectSemester" placeholder="semester" class="handle-select mr10">
                <el-option key="0" label="" value=""></el-option>
                <el-option key="1" label="F2020" value="F2020"></el-option>
                <el-option key="2" label="W2020" value="W2020"></el-option>
                <el-option key="3" label="F2021" value="F2021"></el-option>
                <el-option key="4" label="W2021" value="W2021"></el-option>
                <el-option key="5" label="S2021" value="S2021"></el-option>
            </el-select>

            <el-input v-model="selectCourseNumber" placeholder="course number" class="handle-input mr10"></el-input>
            <el-input v-model="selectNCourseName" placeholder="course name * case Sensitive"
                      class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">search</el-button>
            <el-button type="danger" icon="el-icon-close" @click="cancelSearch">cancel filter</el-button>
        </div>

        <div class="container">
            <el-table :data="courses" border class="table" ref="multipleTable" :stripe="true">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="semester" label="semester">
                </el-table-column>
                <el-table-column prop="number" label="course number" width="120">
                </el-table-column>
                <el-table-column prop="name" label="course name" width="120">
                </el-table-column>
                <el-table-column prop="des" label="course description" width="120">
                </el-table-column>
                <el-table-column prop="startTime" label="start time" width="200">
                </el-table-column>
                <el-table-column prop="endTime" label="end time" width="200">
                </el-table-column>

                <el-table-column prop="tuition" label="tuition">
                </el-table-column>
                <el-table-column prop="textbook" label="textbook">
                </el-table-column>
                <el-table-column prop="firstName" label="instructor">
                </el-table-column>

                <el-table-column
                        prop="status"
                        label="status"
                        width="100"
                        fixed="right"
                        :filters="[{ text: 'activated', value: '1' }, { text: 'deactivated', value: '2' },{text: 'canceled',value:'3'},{text: 'started',value:'4'},{text: 'finished',value:'5'}]"
                        :filter-method="filterStatus"
                        filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                                :type="tagType(scope)"
                                disable-transitions>{{slotContent(scope)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Operation" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="getCourse(scope.row.id)" v-show="scope.row.status === '1'">register</el-button>
                        <el-button style="color: gray" type="text" icon="el-icon-close"  v-show="scope.row.status !== '1'">unavailable</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change="handleChangeNum"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next"
                        :total="totalRecord">
                </el-pagination>
            </div>
        </div>

        <!-- add new course -->
        <el-dialog title="Register a course" :visible.sync="registerVisible" width="50%">
            <form action="/index/charge" method="post">
                <h2 style="margin-bottom: 20px">pleases select your kids</h2>
                <el-select v-model="selectStudentName" placeholder="first name" @change="getRegisterStudentInfo" >
                    <el-option v-for="item in studentList" :label="item.firstName" :value="item.firstName"
                               :key="item.id"></el-option>
                </el-select><br>
                <div class="messageBox">
                    <p v-show="registerStatus === 0">Your kid is valid</p>
                    <p v-show="registerStatus === 1">Your kid is already registed this class</p>
                </div>

<!--                <el-input-->
<!--                        class="showStudent"-->
<!--                        placeholder="check if your kid is valid for register"-->
<!--                        v-model="registerStatus"-->
<!--                        :disabled="true">-->
<!--                </el-input>-->
                <input type="text" v-model="payStudentId" name="studentId" v-show="false"> <br>
                <input type="text" v-model="payCourseId" name="id" v-show="false"><br>
                <input type="text" v-model="payCourseName" name="name" v-show="false"><br>
                <input type="text" v-model="payUserId" name="userId" v-show="false"><br>
                <input type="text" v-model="paySemester" name="semester" v-show="false"><br>
                <input type="text" v-model="payTuition" name="tuition" v-show="false"><br>
                <input type="text" v-model="payStudentName" name="studentName" v-show="false"><br>
                <input type="submit" value="confirm" v-show="registerStatus === 0">
            </form>


            <!--            <el-select v-model="selectStudent" placeholder="first name">-->
            <!--                <el-option v-for="item in studentList" :label="item.firstName" :value="item.firstName"-->
            <!--                           :key="item.id"></el-option>-->
            <!--            </el-select>-->
            <!--            <el-input-->
            <!--                    class="showStudent"-->
            <!--                    placeholder="your kid"-->
            <!--                    v-model="selectStudent"-->
            <!--                    :disabled="true">-->
            <!--            </el-input>-->
            <!--            <el-button type="primary" @click="goPay">Go to payment page</el-button>-->
        </el-dialog>

    </div>
</template>

<script>
    import pageHelperQueryAll from "../../utils/pageHelper";

    import $ from 'jquery';

    export default {
        name: 'coursesAdmin',
        data() {
            return {
                /**
                 *  page helper
                 */
                totalRecord: 0,
                currentPage: 1,
                pageSize: 5,
                /**
                 *  mock user id
                 */

                /**
                 * select data
                 */
                selectSemester: '',
                selectNCourseName: '',
                selectCourseNumber: '',
                selectStudentName: '',
                courses: [],
                courseTemp: [],
                /**
                 * stripe data
                 */
                registerVisible: false,
                registerCourse: {
                    // all we need
                    // id: '',
                    // name: '',
                    // semester:'',
                    // tuition: '',
                },
                instructorList: [],
                studentList: [],

                /**
                 *  payment
                 */
                payStudentId: '',
                payCourseId: '',
                payCourseName: '',
                payUserId: '1',
                paySemester: '',
                payTuition: '',
                payStudentName: '',
                registerStatus:''
            }
        },
        created() {
            this.getData();
            this.getStudent(localStorage.getItem("userId"));
        },
        mounted() {
        },
        computed: {},
        methods: {
            /**
             *  when page num changed
             */
            handleChangeNum(pageNum){
                pageHelperQueryAll('/api/courses', 'post', pageNum, this.pageSize).then(res => {
                    this.totalRecord = JSON.parse(res.totalRows);
                    this.courses = res.list;
                    this.courses = this.courses.filter(item => {
                        return item.status !== '2' && item.status !== '3' && item.status !== '5';
                    })
                    this.courseTemp = this.courses;
                })
            },


            /**
             * query data methods
             */
            getData() {
                pageHelperQueryAll('/api/courses', 'post', 1, this.pageSize).then(res =>{
                        this.totalRecord = JSON.parse(res.totalRows);
                        this.courses = res.list;
                        this.courses = this.courses.filter(item => {
                            return item.status !== '2' && item.status !== '3' && item.status !== '5';
                        })
                        this.courseTemp = this.courses;
                });
            },
            getCourse(id) {
                // reset data
                this.selectStudentName = '';
                this.registerStatus = '';
                this.registerVisible = true;

                this.registerCourse = this.courses.filter(item => {
                    return item.id === id;
                })[0];

                this.payCourseId = this.registerCourse.id;
                this.payCourseName = this.registerCourse.name;
                this.paySemester = this.registerCourse.semester;
                this.payTuition = this.registerCourse.tuition;
            },
            // get student by user's id
            getStudent(id) {
                this.$axios({
                    method: 'get',
                    url: '/api/students/' + id
                }).then(res => {
                    this.studentList = res.data;
                }).catch(error => {
                    this.$message.error(error);
                })
            },
           async getRegisterStudentInfo(){
                this.registerStatus = '';
                let selectedStudent = this.studentList.filter(item => {
                    return item.firstName === this.selectStudentName;
                })[0];

                this.payStudentId = selectedStudent.id;
                this.payStudentName = selectedStudent.firstName;

                await this.checkStatus(this.payStudentId, this.payCourseId);
            },
            /**
             * operation methods
             */
            search() {
                this.courses = this.courseTemp;
                if (this.selectSemester !== '') {
                    this.courses = this.courses.filter(item => {
                        return item.semester === this.selectSemester;
                    })
                }
                if (this.selectCourseNumber !== ''){
                    this.courses = this.courses.filter(item => {
                        return item.number.indexOf(this.selectCourseNumber) !== -1 ;
                    })
                }
                if (this.selectNCourseName !== ''){
                    this.courses = this.courses.filter(item => {
                        return item.name.indexOf(this.selectNCourseName) !== -1 ;
                    })
                }
            },
            cancelSearch() {
                this.courses = this.courseTemp;
                this.selectNCourseName = '';
                this.selectSemester = '';
                this.selectCourseNumber = '';
            },
            change() {
                this.$forceUpdate();
            },
            filterStatus(value, row) {
                return row.status === value;
            },
            slotContent(scope) {
                if (scope.row.status === '1') return 'activated'
                else if (scope.row.status === '2') return 'deactivated'
                else if (scope.row.status === '3') return 'canceled'
                else if (scope.row.status === '4') return 'started'
                else if (scope.row.status === '5') return 'finished'
                else return 'missing';
            },
            tagType(scope) {
                if (scope.row.status === '1') return 'success'
                else if (scope.row.status === '2') return 'info'
                else if (scope.row.status === '3') return 'danger'
                else if (scope.row.status === '4') return 'warning'
                else if (scope.row.status === '5') return 'primary'
                else return 'warning';
            },
            resetForm(formName) {
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                })
            },

            /**
             * payment
             */
            // check if student is valid
            checkStatus(studentId, courseId){
                this.$axios({
                    method:'post',
                    url:'api/check',
                    params:{
                        studentId: studentId,
                        courseId: courseId
                    }
                }).then(res => {
                    this.registerStatus = res.data;
                }).catch(error => {
                    this.$message.error("check status error,pleases check later");
                })
            }

        }
    }

</script>

<style scoped>

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .green {
        color: green;
    }

    .mr10 {
        margin-right: 10px;
    }

    .showStudent {
        margin: 30px 0px;
    }

    .messageBox{
        margin: 20px auto;
    }
</style>
