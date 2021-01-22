<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">Megrez academy</div>
            <el-form :model="login" ref="signIn" label-width="0px" class="ms-content" v-show="isLogin"
                     :rules="sigInRules">
                <div class="ms-title">login in</div>
                <el-form-item prop="username">
                    <el-input v-model="login.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="login.password">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                <div class="login-btn">
                    <el-button type="primary" @click="GoLogin">log in</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="success" @click="GoSignUp">sign up</el-button>
                </div>
            </el-form>

            <el-form :model="signUp" ref="signUp" label-width="0px" class="ms-content" v-show="!isLogin"
                     :rules="signUpRules">
                <div class="ms-title">sign up</div>
                <el-form-item prop="username">
                    <el-input v-model="signUp.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="signUp.password"
                              @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input type="password" placeholder="enter password again" v-model="signUp.repassword">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input type="email" placeholder="email" v-model="signUp.email"
                              @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-chat-line-round"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input type="text" placeholder="phone number" v-model="signUp.phone"
                              @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-phone"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="address">
                    <el-input type="text" placeholder="address" v-model="signUp.address"
                              @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-house"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="firstName">
                    <el-input type="text" placeholder="first name" v-model="signUp.firstName"
                              @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-user"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="lastName">
                    <el-input type="text" placeholder="last name" v-model="signUp.lastName"
                              @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-user"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="GoLogin">log in</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="success" @click="GoSignUp">sign up</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import course from "../../view/course/course";

    export default {
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
                login: {
                    username: '',
                    password: ''
                },
                signUp: {
                    username: '',
                    password: '',
                    repassword: '',
                    email: '',
                    phone: '',
                    address: '',
                    firstName: '',
                    lastName: ''
                },
                isLogin: true,
                sigInRules: {
                    username: [
                        {required: true, message: 'username can not be empty', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: 'password can not be empty', trigger: 'blur'}
                    ]
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
                }
            }
        },
        methods: {
            GoLogin() {
                if (!this.isLogin) {
                    this.isLogin = true;
                } else {
                    this.$refs['signIn'].validate(valid => {
                        if (valid) {
                            this.$axios({
                                method: 'post',
                                url: '/api/user/login',
                                data: this.login
                            }).then(res => {
                                if (res.code !== 0) {
                                    this.$message.error(res.msg);
                                } else {
                                    let user = res.data;
                                    console.log(user);
                                    localStorage.setItem("userId", user.id);
                                    localStorage.setItem("role", user.role);
                                    if (user.role === 'admin') {
                                        this.$router.push('dashboard-admin')
                                    } else {
                                        this.$router.push('dashboard-user')
                                    }
                                }
                            })
                        } else {
                            this.$message.error("pleases entry valid information");
                            return false;
                        }
                    })


                }

            },
            GoSignUp() {
                if (this.isLogin) {
                    this.isLogin = false;
                } else {
                    this.$refs['signUp'].validate(valid => {
                        if (valid) {
                            console.log(this.signUp);
                            this.$axios({
                                method: 'post',
                                url: '/api/user',
                                data: this.signUp
                            }).then(res => {
                                if (res.code === 0) {
                                    this.$message.success("Success! pleases sign in");
                                    this.resetForm('signUp');
                                } else {
                                    this.$message.error(res.msg);
                                }
                            }).catch(error => {
                                console.log(error);
                                this.$message.error("Network problem, pleases try later!");
                            })
                        } else {
                            this.$message.error("pleases follow the sign up instruction.");
                            return false;
                        }
                    })
                }
            },
            checkIfLogedIn() {
                if (localStorage.getItem('userId')) {
                    if (localStorage.getItem('role') === 'user')
                        this.$router.replace('dashboard-user')
                    else this.$router.replace('dashboard-admin')
                }
            },
            resetForm(formName) {
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                })
            },
        },
        created() {
            this.checkIfLogedIn();
        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
