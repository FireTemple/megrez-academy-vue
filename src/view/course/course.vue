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


                <el-table-column label="Operation" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="getCourse(scope.row.id)">register</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- add new course -->
        <el-dialog title="add a new course" :visible.sync="registerVisible" width="50%">

            <div class="container">
                <div class="row">
                    <div class="col-lg-6 col-md-8 col-12 my-auto mx-auto">
                        <h1>
                            Stripe One-Time Charge
                        </h1>
                        <p class="lead mb-4">
                            Please fill the form below to complete the order payment
                        </p>
                        <div class="card mb-4">
                            <div class="card-body">
                                <h5>Leather Bag</h5>
                                <p class="lead">USD 9.99</p>
                            </div>
                        </div>
                        <form action="#" id="payment-form" method="post">
                            <input id="api-key" type="hidden" v-model="stripePublicKey">
                            <div class="form-group">
                                <label class="font-weight-medium" for="card-element">
                                    Enter credit or debit card below
                                </label>
                                <div class="w-100" id="card-element">
                                    <!-- A Stripe Element will be inserted here. -->
                                </div>
                            </div>
                            <div class="form-group">
                                <input class="form-control" id="studentId" name="studentId"
                                       placeholder="Marry" type="text" required disabled>
                            </div>
                            <!-- Used to display Element errors. -->
                            <div class="text-danger w-100" id="card-errors" role="alert"></div>
                            <div class="form-group pt-2">
                                <button class="btn btn-primary btn-block" id="submitButton" type="submit">
                                    Pay With Your Card
                                </button>
                                <div class="small text-muted mt-2">
                                    Pay securely with Stripe. By clicking the button above, you agree
                                    to our <a target="_blank" href="#">Terms of Service</a>,
                                    <a target="_blank" href="#">Privacy</a> and
                                    <a target="_blank" href="#">Refund</a> policies.

                                </div>
                            </div>


                        </form>
                        <p class="mt-5 text-muted">
                            <small>An example project by <a th:href="@{https://attacomsian.com}" target="_blank">Atta</a>.
                            </small>
                        </p>
                    </div>
                </div>
            </div>


        </el-dialog>

    </div>
</template>

<script>
    /**
     *  import js & css for shrip
     */
    import '../../stripe/jquery-3.3.1.min';
    import '../../stripe/bootstrap.min';
    import Stripe from 'stripe';
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
                /**
                 * stripe data
                 */
                stripePublicKey:'pk_test_51HGsptBGqOo2oeGirp7bOUiNkiYl1GvGlJgGtXFLn1bUwOxJEIuERBDv5TiFS3BGjl7N0IQ7NJRt4hcurFUTD6Dn00guDvS7oi',

                registerVisible: true,
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

        },
        mounted() {
            this.initStrip();
        },
        computed: {},
        methods: {
            /**
             * query data methods
             */
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
            search() {
                this.courses = this.courseTemp;
                if (this.selectSemester !== '') {
                    this.courses = this.courses.filter(item => {
                        return item.semester === this.selectSemester;
                    })
                }
                if (this.selectCourseNumber !== '') {
                    this.courses = this.courses.filter(item => {
                        return item.number === this.selectCourseNumber;
                    })
                }
                if (this.selectNCourseName !== '') {
                    this.courses = this.courses.filter(item => {
                        return item.name === this.selectNCourseName;
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
                else return 'cancel';
            },
            tagType(scope) {
                if (scope.row.status === '1') return 'success'
                else if (scope.row.status === '2') return 'info'
                else if (scope.row.status === '3') return 'danger'
                else return 'warning';
            },
            resetForm(formName) {
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                })
            },

            /**
             * strip methods
             */
            handlePayments(stripe,card){
                stripe.createToken(card).then(function (result) {
                    if (result.error) {
                        // Inform the user if there was an error.
                        let errorElement = document.getElementById('card-errors');
                        errorElement.textContent = result.error.message;
                    } else {
                        // Send the token to your server.
                        let token = result.token.id;
                        let email = $('#email').val();
                        $.post(
                            "/create-charge",
                            {email: email, token: token},
                            function (data) {
                                console.log(data);
                            }, 'json');
                    }
                });
            },
            initStrip(){
                let API_KEY = this.stripePublicKey;
                // Create a Stripe client.
                let stripe = Stripe(API_KEY);

                // Create an instance of Elements.
                let elements = stripe.elements();

                // Create an instance of the card Element.
                let card = elements.create('card');

                // Add an instance of the card Element into the `card-element` <div>.
                card.mount('#card-element');

                // Handle real-time validation errors from the card Element.
                card.addEventListener('change', function (event) {
                    let displayError = document.getElementById('card-errors');
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }
                });

                // Handle form submission.
                let form = document.getElementById('payment-form');
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                    // handle payment
                    this.handlePayments(stripe,card);
                });
            }
        }
    }

</script>

<style scoped>
    @import "../../stripe/bootstrap.min.css";

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
