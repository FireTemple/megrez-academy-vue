<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>Courses Admin</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <!--            <el-button type="primary" icon="delete" class="handle-del mr10" >removed</el-button>-->
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
            <el-button type="success" icon="el-icon-plus" @click="openAddPage">add new course</el-button>
        </div>

        <div class="container">
            <el-table :data="courses" border class="table" ref="multipleTable" :stripe="true">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="course id" width="150">
                </el-table-column>


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
                        <el-button type="text" icon="el-icon-edit" @click="getCourse(scope.row.id)">edit</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteCourse(scope.row.id)"
                                   v-show="scope.row.status !== '3'">delete
                        </el-button>
                        <el-button type="text" icon="el-icon-check" style="color: #00a854"
                                   @click="startCourse(scope.row.id)"
                                   v-show="scope.row.status === '1'">start
                        </el-button>
                        <el-button type="text" icon="el-icon-check" style="color: #00a854"
                                   @click="courseStudentDetailsF(scope.row.id)"
                                   v-show="scope.row.status !== '2' && scope.row.status !== '3' && scope.row.status !== '5'">
                            details
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">

                <el-pagination background @current-change="" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="edit" :visible.sync="editVisible" width="50%">
            <el-form ref="editCourse" :model="editCourse" label-width="80px">
                <el-form-item label="course id" prop="id">
                    <el-input v-model="editCourse.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="semester" prop="semester">
                    <el-input v-model="editCourse.semester"></el-input>
                </el-form-item>
                <el-form-item label="course number" prop="number">
                    <el-input v-model="editCourse.number"></el-input>
                </el-form-item>
                <el-form-item label="name" prop="name">
                    <el-input v-model="editCourse.name"></el-input>
                </el-form-item>
                <el-form-item label="session" prop="session">
                    <el-input v-model="editCourse.session"></el-input>
                </el-form-item>
                <el-form-item label="status" prop="firstName">
                    <el-select v-model="editCourse.status" placeholder="status">
                        <el-option key="1" label="activated" value="1"></el-option>
                        <el-option key="2" label="inactivated" value="2"></el-option>
                        <el-option key="3" label="canceled" value="3"></el-option>
                        <el-option key="4" label="started" value="4"></el-option>
                        <el-option key="5" label="finished" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="description" prop="des">
                    <el-input v-model="editCourse.des"></el-input>
                </el-form-item>
                <el-form-item label="start time" prop="startTime">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="pick date"
                                    v-model="editCourse.startTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="end time" prop="endTime">
                    <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="pick date"
                                    v-model="editCourse.endTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="instructor" prop="firstName">
                    <el-select v-model="editCourse.firstName" placeholder="instructor" @change="changeTId">
                        <el-option v-for="item in instructorList" :key="item.id" :label="item.firstName"
                                   :value="item.firstName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="tuition $" prop="tuition">
                    <el-input v-model="editCourse.tuition" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="textbook" prop="textbook">
                    <el-input v-model="editCourse.textbook" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="prerequisite" prop="prerequisite">
                    <el-input v-model="editCourse.prerequisite" size="mini"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelEdit">Cancel</el-button>
                    <el-button type="primary" @click="updateCourse">Save</el-button>
                </span>
        </el-dialog>
        <!-- add new course -->
        <el-dialog title="add a new course" :visible.sync="addCourseVisible" width="50%">
            <el-form ref="addCourse" :model="editCourse" label-width="80px">
                <el-form-item label="semester" prop="semester">
                    <el-input v-model="editCourse.semester"></el-input>
                </el-form-item>
                <el-form-item label="course number" prop="number">
                    <el-input v-model="editCourse.number"></el-input>
                </el-form-item>
                <el-form-item label="name" prop="name">
                    <el-input v-model="editCourse.name"></el-input>
                </el-form-item>
                <el-form-item label="session" prop="session">
                    <el-input v-model="editCourse.session"></el-input>
                </el-form-item>
                <el-form-item label="instructor" prop="firstName">
                    <el-select v-model="editCourse.status" placeholder="instructor">
                        <el-option key="1" label="activated" value="1"></el-option>
                        <el-option key="2" label="inactivated" value="2"></el-option>
                        <el-option key="4" label="canceled" value="4"></el-option>
                        <el-option key="5" label="started" value="5"></el-option>
                        <el-option key="6" label="finished" value="6"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="description" prop="des">
                    <el-input v-model="editCourse.des"></el-input>
                </el-form-item>
                <el-form-item label="start time" prop="startTime">
                    <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="pick date"
                                    v-model="editCourse.startTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="end time" prop="endTime">
                    <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="pick date"
                                    v-model="editCourse.endTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="instructor" prop="firstName">
                    <el-select v-model="editCourse.firstName" placeholder="instructor" @change="changeTId">
                        <el-option v-for="item in instructorList" :key="item.id" :label="item.firstName"
                                   :value="item.firstName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="tuition $" prop="tuition">
                    <el-input v-model="editCourse.tuition" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="textbook" prop="textbook">
                    <el-input v-model="editCourse.textbook" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="prerequisite" prop="prerequisite">
                    <el-input v-model="editCourse.prerequisite" size="mini"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelAdd">Cancel</el-button>
                    <el-button type="primary" @click="addCourse">add</el-button>
                </span>
        </el-dialog>
        <!-- detail student table-->
        <el-dialog title="Course student details" :visible.sync="courseStudentDetails" width="80%">
            <el-table :data="courseDetailList" border class="table" ref="multipleTable" :stripe="true" :fit="true">
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
            </el-table>

            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelDetail">Cancel</el-button>
                </span>
        </el-dialog>
        <!--        &lt;!&ndash; 删除提示框 &ndash;&gt;-->
        <!--        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>-->
        <!--            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>-->
        <!--            <span slot="footer" class="dialog-footer">-->
        <!--                <el-button @click="delVisible = false">取 消</el-button>-->
        <!--                <el-button type="primary" @click="deleteRow">确 定</el-button>-->
        <!--            </span>-->
        <!--        </el-dialog>-->
    </div>
</template>

<script>
    export default {
        name: 'coursesAdmin',
        data() {
            return {

                /**
                 * select data
                 */
                selectSemester: '',
                selectNCourseName: '',
                selectCourseNumber: '',

                courses: [],
                courseTemp: [],
                courseDetailList: [],
                editVisible: false,
                addCourseVisible: false,
                courseStudentDetails: false,

                editCourse: {
                    id: '',
                    name: '',
                    session: '',
                    startTime: '',
                    endTime: '',
                    tuition: '',
                    textbook: '',
                    prerequisite: '',
                    des: '',
                    status: '',
                    semester: '',
                    number: '',
                    lastName: '',
                    firstName: '',
                    tId: ''
                },

                instructorList: []
            }
        },
        created() {
            this.getData();
            this.getInstructor();
        },
        computed: {},
        methods: {
            /**
             * query data methods
             */
            getInstructor() {
                this.$axios({
                    method: 'get',
                    url: '/api/professors'
                }).then(res => {
                    this.instructorList = res.data;
                }).catch(error => {
                    console.log(error);
                })
            },
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/api/coursesAdmin',
                }).then(res => {
                    this.courses = res.data;
                    this.courseTemp = res.data;
                }).catch(error => {
                    this.$message.error("data load failed");
                })
            },
            getCourse(id) {
                this.editVisible = true;
                return this.$axios({
                    method: 'get',
                    url: '/api/course/' + id,
                }).then(res => {
                    this.editCourse = res.data;
                    console.log(res.data);
                }).catch(error => {
                    this.$message.error("system error, pleases try later");
                });
            },

            /**
             * operation methods
             */
            updateCourse() {
                console.log(this.editCourse);
                this.$axios({
                    method: 'put',
                    url: '/api/course',
                    data: this.editCourse
                }).then(res => {
                    this.$message.success(res.msg);
                    this.getData();
                    this.getCourse(this.editCourse.id);
                    console.log(this.editCourse)
                }).catch(error => {
                    this.$message.error("system error, pleases try later");
                })
            },
            changeTId() {
                this.editCourse.tId = this.instructorList.filter(item => {
                    return item.firstName === this.editCourse.firstName;
                })[0].id;
            },

            search() {
                this.courses = this.courseTemp;
                if (this.selectSemester !== '') {
                    this.courses = this.courses.filter(item => {
                        return item.semester === this.selectSemester;
                    })
                }
                if (this.selectCourseNumber !== '') {
                    this.courses = this.courses.filter(item => {
                        return item.number.indexOf(this.selectCourseNumber) !== -1;
                    })
                }
                if (this.selectNCourseName !== '') {
                    this.courses = this.courses.filter(item => {
                        return item.name.indexOf(this.selectNCourseName) !== -1;
                    })
                }
            },
            cancelSearch() {
                this.courses = this.courseTemp;
                this.selectNCourseName = '';
                this.selectSemester = '';
                this.selectCourseNumber = '';
            },
            removeItem(item) {
                let index = this.editCourse.includeItems.indexOf(item)
                if (index !== -1) {
                    this.editCourse.includeItems.splice(index, 1)
                }
                this.$axios({
                    method: 'delete',
                    url: '/api/courses/delete/' + item.id
                }).then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                })

                this.$forceUpdate();

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
            deleteCourse(id) {
                this.$confirm('This operation will permanently delete the file, do you want to continue?', 'Notification', {
                    confirmButtonText: 'confirm',
                    cancelButtonText: 'cancel',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'get',
                        url: 'api/course/delete/' + id
                    }).then(res => {
                        this.$message.success(res.msg);
                        this.getData();
                    }).catch(error => {
                        console.log(error);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'already canceled delete'
                    });
                });

            },
            async startCourse(id) {
                let nums = [];
                await this.$axios({
                    method: 'get',
                    url: '/api/current/students/' + id
                }).then(res => {
                    nums = res.data.length;
                })
                await this.$confirm('Are your sure you want start this class, there are ' + nums + ' students will be charged', 'Notification', {
                    confirmButtonText: 'confirm',
                    cancelButtonText: 'cancel',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'get',
                        url: '/index/create-charge/' + id
                    }).then(res => {
                        this.$axios({
                            method: 'get',
                            url: '/api/course/start/' + id
                        }).then(res => {
                            this.$message.success(res.msg);
                            this.getData();
                        }).catch(error => {
                            console.log(error);
                        })
                    }).catch(error => {
                        console.log(error);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'already canceled start course'
                    });
                });
            },
            courseStudentDetailsF(id) {
                this.$axios({
                    method: 'get',
                    url: '/api/students/course/' + id
                }).then(res => {
                    this.courseDetailList = res.data;
                    this.courseStudentDetails = true;
                })
            },
            cancelEdit() {
                this.editVisible = false;
                this.getData();
            },
            cancelDetail() {
                this.courseStudentDetails = false;
            },
            cancelUpload() {
                this.uploadImgVisible = false;
            },
            openAddPage() {
                this.resetForm('addCourse');
                this.addCourseVisible = true;
            },
            resetForm(formName) {
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                })
            },

            /**
             *  add new instructor methods
             */
            cancelAdd() {
                this.addCourseVisible = false;
            },
            addCourse() {
                this.$axios({
                    method: 'post',
                    url: "/api/course",
                    data: this.editCourse
                }).then(res => {
                    console.log(res)
                    this.getData()
                    this.$message.success(res.msg);
                }).catch(error => {
                    this.$message.info(error);
                })
            },
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
