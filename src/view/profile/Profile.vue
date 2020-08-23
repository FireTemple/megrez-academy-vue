<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>My Profile</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="ms-title">edit your information</div>

        <div class="container">
            <div class="form-box">
                <el-form :model="user" ref="edit" label-width="0px" class="ms-content"
                         :rules="signUpRules">

                    <el-form-item prop="username">
                        <el-input v-model="user.username" placeholder="username" disabled>
                            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="email">
                        <el-input type="email" placeholder="email" v-model="user.email"
                        >
                            <el-button slot="prepend" icon="el-icon-chat-line-round"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="phone">
                        <el-input type="text" placeholder="phone number" v-model="user.phone"
                        >
                            <el-button slot="prepend" icon="el-icon-phone"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="address">
                        <el-input type="text" placeholder="address" v-model="user.address"
                        >
                            <el-button slot="prepend" icon="el-icon-house"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="firstName">
                        <el-input type="text" placeholder="first name" v-model="user.firstName"
                        >
                            <el-button slot="prepend" icon="el-icon-user"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="lastName">
                        <el-input type="text" placeholder="last name" v-model="user.lastName"
                        >
                            <el-button slot="prepend" icon="el-icon-user"></el-button>
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="success" @click="update">Update your info</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <div class="ms-title"> your kids information</div>

        <div class="container">
            <!--            <el-select v-model="selectStudent" placeholder="current course"-->
            <!--                       class="handle-select mr10" style="margin-bottom: 30px;width: 200px">-->
            <!--                <el-option v-for="item in studentLists" :key="item.id" :label="item.firstName"-->
            <!--                           :value="item.firstName"></el-option>-->
            <!--            </el-select>-->
            <el-button type="success" icon="el-icon-lx-people" style="margin-bottom: 20px" @click="addVisible = true">
                add new student
            </el-button>

            <el-table :data="studentLists" border class="table" ref="multipleTable" :stripe="true" :fit="true">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--                <el-table-column prop="id" label="student id" width="350" ></el-table-column>-->
                <el-table-column prop="firstName" label="first name" width="200"></el-table-column>
                <el-table-column prop="lastName" label="last name" width="200"></el-table-column>
                <el-table-column prop="birth" label="birth" width="200"></el-table-column>
                <el-table-column prop="currentSchool" label="current school" width="300"></el-table-column>
                <el-table-column prop="currentGrade" label="current grade" width="200"></el-table-column>
                <el-table-column label="gender" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" v-show="scope.row.gender === '1'">male</el-button>
                        <el-button type="danger" v-show="scope.row.gender === '2'">female</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="Operation" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="danger" icon="el-icon-delete" class="red" @click="deleteStudent(scope.row.id)">
                            delete
                        </el-button>
                        <el-button type="success" icon="el-icon-edit" class="red" @click="editStudent1(scope.row.id)">
                            edit
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- edit -->
        <el-dialog title="edit" :visible.sync="editVisible" width="50%">
            <el-form ref="editStudent" :model="editStudent" label-width="80px">
                <el-form-item label="student id" prop="id">
                    <el-input v-model="editStudent.id" v-show="false"></el-input>
                </el-form-item>
                <el-form-item label="first name" prop="firstName">
                    <el-input v-model="editStudent.firstName"></el-input>
                </el-form-item>
                <el-form-item label="last name" prop="lastName">
                    <el-input v-model="editStudent.lastName"></el-input>
                </el-form-item>
                <el-form-item label="current school" prop="currentSchool">
                    <el-input v-model="editStudent.currentSchool"></el-input>
                </el-form-item>
                <el-form-item label="current grade" prop="currentGrade">
                    <el-input v-model="editStudent.currentGrade"></el-input>
                </el-form-item>
                <el-form-item label="birth" prop="birth">
                    <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="pick date" v-model="editStudent.birth"
                                    style="width: 100%;" > </el-date-picker>
                </el-form-item>
                <el-form-item label="gender" prop="gender">
                    <el-select v-model="editStudent.gender" placeholder="gender">
                        <el-option key="1" label="male" value="1"></el-option>
                        <el-option key="2" label="female" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelEdit">Cancel</el-button>
                    <el-button type="primary" @click="updateStudent">Save</el-button>
                </span>
        </el-dialog>
        <!-- add new -->
        <el-dialog title="add" :visible.sync="addVisible" width="50%">
            <el-form ref="addStudent" :model="addStudent" label-width="80px">
                <el-form-item label="first name" prop="firstName">
                    <el-input v-model="addStudent.firstName"></el-input>
                </el-form-item>
                <el-form-item label="last name" prop="lastName">
                    <el-input v-model="addStudent.lastName"></el-input>
                </el-form-item>
                <el-form-item label="current school" prop="currentSchool">
                    <el-input v-model="addStudent.currentSchool"></el-input>
                </el-form-item>
                <el-form-item label="current grade" prop="currentGrade">
                    <el-input v-model="addStudent.currentGrade"></el-input>
                </el-form-item>
                <el-form-item label="birth" prop="birth">
                    <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="pick date" v-model="addStudent.birth"
                                    style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="gender" prop="gender">
                    <el-select v-model="addStudent.gender" placeholder="gender">
                        <el-option key="1" label="male" value="1"></el-option>
                        <el-option key="2" label="female" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelAdd">Cancel</el-button>
                    <el-button type="primary" @click="addStudent1">submit</el-button>
                </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: 'profile',
        data: function () {
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter the password again'));
                } else if (value !== this.signUp.password) {
                    callback(new Error('The two passwords are inconsistent!'));
                } else {
                    callback();
                }
            };
            return {
                user: {
                    id: localStorage.getItem('userId'),
                    username: '',
                    phone: '',
                    email: '',
                    address: '',
                    firstName: '',
                    lastName: '',
                },
                signUpRules: {
                    username: [
                        {required: true, message: 'username can not be empty', trigger: 'blur'},
                        {min: 3, max: 15, message: 'length between 3 to 15 characters', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: 'password can not be empty', trigger: 'blur'},
                        {min: 3, max: 15, message: 'length between 3 to 15 characters', trigger: 'blur'}
                    ],
                    repassword: [
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: 'email can not be empty', trigger: 'blur'},
                        {type: 'email', message: 'pleases enter valid email address', trigger: ['blur', 'change']}
                    ],
                    phone: [
                        {
                            required: true,
                            message: 'pleases enter valid phone number',
                            pattern: /^[34578]\d{9}$/,
                            trigger: 'blur'
                        }
                    ],
                    firstName: [
                        {required: true, message: 'pleases enter valid phone number', trigger: 'blur'}
                    ],
                    lastName: [
                        {required: true, message: 'pleases enter valid phone number', trigger: 'blur'}
                    ]
                },
                studentLists: [],
                selectStudent: '',

                editStudent: {
                    id: '',
                    firstName: '',
                    lastName: '',
                    birth: '',
                    gender: '',
                    currentSchool: '',
                    currentGrade: '',
                },
                addStudent: {
                    firstName: '',
                    lastName: '',
                    birth: '',
                    gender: '',
                    currentSchool: '',
                    currentGrade: '',
                },
                editVisible: false,
                addVisible: false,
            }
        },
        created() {
            this.getInfo();

        },
        methods: {
            onSubmit() {
                this.$message.success('提交成功！');
            },
            update() {
                this.$axios({
                    method: 'put',
                    url: '/api/user',
                    data: this.user
                }).then(res => {
                    this.getInfo();
                })
            },
            async getInfo() {
                let id = localStorage.getItem('userId');
                await this.$axios({
                    method: 'get',
                    url: '/api/user/' + id
                }).then(res => {
                    if (res.code === 0) {
                        this.user = res.data
                        this.$axios({
                            method: 'get',
                            url: '/api/students/' + id
                        }).then(res => {
                            if (res.code === 0) {
                                this.studentLists = res.data;
                                console.log(res);
                            }
                        })
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            deleteStudent(id) {
                this.$confirm('This operation will permanently delete this student, do you want to continue?', 'Notification', {
                    confirmButtonText: 'confirm',
                    cancelButtonText: 'cancel',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method:'delete',
                        url: '/api/student/' + id
                    }).then(res => {
                        this.$message.info(res.msg);
                        this.$axios({
                            method: 'get',
                            url: '/api/students/' + localStorage.getItem("userId")
                        }).then(res => {
                            if (res.code === 0) {
                                this.studentLists = res.data;
                            }
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'already canceled delete'
                    });
                });


            },
            editStudent1(id) {
                this.editVisible = true;
                this.$axios({
                    method: 'get',
                    url: '/api/student/' + id
                }).then(res => {
                    this.editStudent = res.data;
                    this.editStudent.p_id = localStorage.getItem("userId");
                })
            },
            cancelEdit() {
                this.editVisible = false;
                this.editStudent = '';
            },
            cancelAdd() {
                this.addVisible = false;
                this.addStudent = '';
            },
            async updateStudent() {
                this.$axios({
                    method: 'put',
                    url: '/api/student',
                    data: this.editStudent
                }).then(res => {
                    this.$message.success(res.msg);
                    this.editVisible = false;
                    this.$axios({
                        method: 'get',
                        url: '/api/students/' + localStorage.getItem("userId")
                    }).then(res => {
                        if (res.code === 0) {
                            this.studentLists = res.data;
                        }
                    })
                }).catch(error => {
                    console.log(error);
                })
            },
            async addStudent1() {
                // if (localStorage.getItem("userId") !== null) {
                //     this.$message.error("Your login info is expired, pleases sign in again");
                //     this.$router.push('login');
                // }
                this.addStudent.pId = localStorage.getItem("userId");
                console.log(this.addStudent);
                await this.$axios({
                    method:'post',
                    url:'/api/student',
                    data: this.addStudent
                }).then(res => {
                    this.$message.success(res.msg)
                    this.$axios({
                        method: 'get',
                        url: '/api/students/' + localStorage.getItem("userId")
                    }).then(res => {
                        if (res.code === 0) {
                            this.studentLists = res.data;
                        }
                    })
                })
            }
        }
    }
</script>

<style scoped>
    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: black;
        border-bottom: 1px solid #ddd;
    }
</style>
