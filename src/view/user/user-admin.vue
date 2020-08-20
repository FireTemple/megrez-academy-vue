<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>user admin</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <el-input v-model="selectUsername" placeholder="course number" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">search</el-button>
            <el-button type="danger" icon="el-icon-close" @click="cancelSearch">cancel filter</el-button>
            <el-button type="success" icon="el-icon-plus" @click="openAddPage">add new course</el-button>
        </div>

        <div class="container">
            <el-table :data="users" border class="table" ref="multipleTable" :stripe="true">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="user id" width="150">
                </el-table-column>
                <el-table-column prop="username" label="username" width="150">
                </el-table-column>
                <el-table-column prop="phone" label="phone number" width="120">
                </el-table-column>
                <el-table-column prop="email" label="e-mail" width="200">
                </el-table-column>
                <el-table-column prop="address" label="address" width="400">
                </el-table-column>
                <el-table-column prop="firstName" label="first name" width="200">
                </el-table-column>
                <el-table-column prop="lastName" label="last name" width="200">
                </el-table-column>

                <el-table-column prop="createTime" label="register date" width="300">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="user status"
                        width="100"
                        fixed="right"
                        :filters="[{ text: 'activated', value: '1' }, { text: 'blackList', value: '2' }]"
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
                        <el-button type="text" icon="el-icon-edit" @click="getUser(scope.row.id)">edit</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteUser(scope.row.id)"
                                   v-show="scope.row.status !== '3'">delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- edit form -->
        <el-dialog title="edit" :visible.sync="editVisible" width="50%">
            <el-form ref="editUser" :model="editUser" label-width="80px">
                <el-form-item label="user id" prop="id">
                    <el-input v-model="editUser.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="username" prop="username">
                    <el-input v-model="editUser.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="first name" prop="firstName">
                    <el-input v-model="editUser.firstName"></el-input>
                </el-form-item>
                <el-form-item label="last name" prop="lastName">
                    <el-input v-model="editUser.lastName"></el-input>
                </el-form-item>
                <el-form-item label="phone number" prop="phone">
                    <el-input v-model="editUser.phone"></el-input>
                </el-form-item>
                <el-form-item label="address" prop="address">
                    <el-input v-model="editUser.address"></el-input>
                </el-form-item>
                <el-form-item label="status" prop="address">
                    <el-select v-model="editUser.status" placeholder="status">
                        <el-option key="1" label="activated" value="1"></el-option>
                        <el-option key="2" label="blackList" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelEdit">Cancel</el-button>
                    <el-button type="primary" @click="updateUser">Save</el-button>
                </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'userAdmin',
        data() {
            return {
                /**
                 * select data
                */
                selectUsername:'',

                /**
                 * render data
                 */

                users: [],
                usersTemp:[],

                /**
                 * hidden data
                 */
                editVisible: false,
                editUser: {
                    id: '',
                    username: '',
                    phone: '',
                    email: '',
                    address: '',
                    firstName: '',
                    lastName: '',
                    prerequisite: '',
                    status: '',
                },
            }
        },
        created() {
            this.getData();
        },
        computed: {},
        methods: {
            /**
             * query data methods
             */
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/api/users',
                }).then(res => {
                    this.users = res.data;
                    this.usersTemp = res.data;
                }).catch(error => {
                    this.$message.error("data load failed");
                })
            },
            getUser(id){
                this.editVisible = true;
               return this.$axios({
                    method: 'get',
                    url: '/api/user/' + id,
                }).then(res => {
                    this.editUser = res.data;
                }).catch(error => {
                    this.$message.error("system error, pleases try later");
                });
            },

            /**
             * operation methods
             */
            updateUser() {
                this.$axios({
                    method: 'put',
                    url: '/api/user',
                    data: this.editUser
                }).then(res => {
                    this.$message.success(res.msg);
                    this.getData();
                    this.getUser(this.editUser.id);
                }).catch(error => {
                    this.$message.error("system error, pleases try later");
                })
            },

            search(){
                this.courses = this.courseTemp;
                if (this.selectSemester !== ''){
                    this.courses = this.courses.filter(item => {
                        return item.semester === this.selectSemester;
                    })
                }
                if (this.selectCourseNumber !== ''){
                    this.courses = this.courses.filter(item => {
                        return item.number === this.selectCourseNumber;
                    })
                }
                if (this.selectNCourseName !== ''){
                    this.courses = this.courses.filter(item => {
                        return item.name === this.selectNCourseName;
                    })
                }
            },
            cancelSearch(){
                this.courses = this.courseTemp;
                this.selectNCourseName = '';
                this.selectSemester = '';
                this.selectCourseNumber = '';
            },

            change() {
                this.$forceUpdate();
            },

            /**
             * status methods
             */
            filterStatus(value, row) {
                return row.status === value;
            },
            slotContent(scope) {
                if (scope.row.status === '1') return 'activated'
                else if (scope.row.status === '2') return 'blackList'
                else return 'missing';
            },
            tagType(scope) {
                if (scope.row.status === '1') return 'success'
                else if (scope.row.status === '2') return 'danger'
                else return 'warning';
            },



            deleteUser(id) {
                this.$confirm('This operation will permanently delete the file, do you want to continue?', 'Notification', {
                    confirmButtonText: 'confirm',
                    cancelButtonText: 'cancel',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'delete',
                        url: '/api/user/' + id
                    }).then(res => {
                        this.$message.success(res.msg);
                        this.getData();
                    }).catch(error => {
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'already canceled delete'
                    });
                });

            },
            cancelEdit() {
                this.editVisible = false;
            },

            openAddPage(){
                this.resetForm('editUser');
                this.addCourseVisible = true;
            },
            resetForm(formName) {
                this.$nextTick(()=>{
                    this.$refs[formName].resetFields();
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
