<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>Courses Admin</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <el-input v-model="selectFirstName" placeholder="student's first name case sensitive"
                      class="handle-input mr10"></el-input>

            <el-button type="primary" icon="el-icon-search" @click="search">search</el-button>
            <el-button type="danger" icon="el-icon-close" @click="cancelSearch">cancel filter</el-button>
        </div>

        <div class="container">
            <el-select v-model="selectCourse" placeholder="current course"
                       class="handle-select mr10" style="margin-bottom: 30px;width: 200px">
                <el-option v-for="item in currentCourses" :key="item.id" :label="item.name"
                           :value="item.name"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="selectStudents">show students</el-button>
            <el-button type="success" icon="el-icon-search" @click="showAll">show all students</el-button>
            <el-button type="info" icon="el-icon-refresh" @click="refresh">refresh</el-button>

            <el-table :data="students" border class="table" ref="multipleTable" :stripe="true" :fit="true">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="student id" width="350"></el-table-column>
                <el-table-column prop="firstName" label="first name" width="200"></el-table-column>
                <el-table-column prop="lastName" label="last name" width="200"></el-table-column>
                <el-table-column prop="birth" label="birth" width="200"></el-table-column>
                <el-table-column label="gender" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" v-show="scope.row.gender === '1'">male</el-button>
                        <el-button type="text" v-show="scope.row.gender === '2'">female</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="status"
                        width="200"
                        :filters="[{ text: 'current', value: '1' }, { text: 'deleted', value: '2' }]"
                        :filter-method="filterStatus"
                        filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                                :type="tagType(scope)"
                                disable-transitions>{{slotContent(scope)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Operation" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteStudent(scope.row.id)"
                                   v-show="scope.row.status !== '3'">delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background  layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        name: 'coursesAdmin',
        data() {
            return {

                /**
                 *  table data
                 */
                students: [],
                tempStudents: [],



                /**
                 * select data
                 */
                selectFirstName: '',
                currentCourses: [],
                selectCourse: '',


            }
        },
        created() {
            this.getData();
            this.getCurrentCourse();
        },
        computed: {},
        methods: {
            /**
             * query data methods
             */
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/api/students',
                }).then(res => {
                    this.students = res.data;
                    this.tempStudents = res.data;
                    console.log(this.students);
                }).catch(error => {
                    this.$message.error("data load failed");
                })
            },
            getCurrentCourse() {
                this.$axios({
                    method: 'get',
                    url: '/api/current/courses',
                }).then(res => {
                    this.currentCourses = res.data;

                }).catch(error => {
                    this.$message.error("system error, pleases try later");
                });
            },

            /**
             * operation methods
             */
            deleteStudent(id) {
                this.$axios({
                    method: 'delete',
                    url: '/api/student' + id
                }).then(res => {
                    this.$message.info(res.data);
                }).catch(error => {
                    this.$message.error("delete failed!")
                    console.log(error);
                })
            },
            /**
             * search methods
             */
            search() {
                this.students = this.tempStudents;

                if (this.selectFirstName !== '') {
                    this.students = this.students.filter(item => {
                        return item.firstName.indexOf(this.selectFirstName) !== -1;
                    })
                }
            },
            cancelSearch() {
                this.students = this.tempStudents;
                this.selectFirstName = '';
            },

            /**
             *  render methods
             */
            filterStatus(value, row) {
                return row.status === value;
            },
            slotContent(scope) {
                if (scope.row.status === '1') return 'current'
                else if (scope.row.status === '2') return 'deleted'
                else return 'missing'
            },
            tagType(scope) {
                if (scope.row.status === '1') return 'success'
                else if (scope.row.status === '2') return 'info'
                else return 'warning';
            },


            /**
             *  common methods
             */

            change() {
                this.$forceUpdate();
            },
            resetForm(formName) {
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                })
            },

            /**
             *  select course's student
             */
            async selectStudents() {

                let courseId = this.currentCourses.filter(item => {
                    return item.name === this.selectCourse;
                })[0].id;

                console.log(courseId);

                await this.$axios({
                    method: 'get',
                    url:'/api/current/students/' + courseId
                }).then(res => {
                    this.students = res.data;
                })
            },
            showAll(){
                this.students = this.tempStudents;
                this.selectCourse = '';
            },
            refresh(){
                this.getCurrentCourse();
                this.getData();
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
</style>
