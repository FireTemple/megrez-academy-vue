<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>Courses Admin</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <el-input v-model="selectFirstName" placeholder="instructor first name" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">search</el-button>
            <el-button type="danger" icon="el-icon-close" @click="cancelSearch">cancel filter</el-button>
            <el-button type="success" icon="el-icon-plus" @click="openAddPage">add new course</el-button>
        </div>

        <div class="container">
            <el-table :data="instructors" border class="table" ref="multipleTable" :stripe="true" :fit="true">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="instructor id" width="350"></el-table-column>
                <el-table-column prop="firstName" label="first name" width="200"></el-table-column>
                <el-table-column prop="lastName" label="last name" width="200"></el-table-column>
                <el-table-column prop="phone" label="phone number" width="200"></el-table-column>
                <el-table-column prop="email" label="e-mail address" width="200"></el-table-column>
                <el-table-column
                        prop="status"
                        label="status"
                        width="200"
                        :filters="[{ text: 'current', value: '1' }, { text: 'deactivated', value: '2' },{text: 'missing',value:'3'}]"
                        :filter-method="filterStatus"
                        filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                                :type="tagType(scope)"
                                disable-transitions>{{slotContent(scope)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Operation" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="getInstructor(scope.row.id)">edit</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteInstructor(scope.row.id)"
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

        <!-- 编辑弹出框 -->
        <el-dialog title="edit instructor" :visible.sync="editVisible" width="50%">
            <el-form ref="editInstructor" :model="editInstructor" label-width="80px">
                <el-form-item label="course id" prop="id">
                    <el-input v-model="editInstructor.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="first name" prop="firstName">
                    <el-input v-model="editInstructor.firstName"></el-input>
                </el-form-item>
                <el-form-item label="last name" prop="lastName">
                    <el-input v-model="editInstructor.lastName"></el-input>
                </el-form-item>
                <el-form-item label="phone number" prop="phone">
                    <el-input v-model="editInstructor.phone"></el-input>
                </el-form-item>
                <el-form-item label="e-mail address" prop="email">
                    <el-input v-model="editInstructor.email"></el-input>
                </el-form-item>
                <el-form-item label="status" prop="status">
                    <el-select v-model="editInstructor.status" placeholder="status">
                        <el-option key="1" label="activated" value="1"></el-option>
                        <el-option key="2" label="inactivated" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelEdit">Cancel</el-button>
                    <el-button type="primary" @click="updateInstructor">Save</el-button>
            </span>
        </el-dialog>
        <!-- add new instructor -->
        <el-dialog title="add a new instructor" :visible.sync="addInstructorVisible" width="50%">
            <el-form ref="addInstructor" :model="editInstructor" label-width="80px">
                <el-form-item label="first name" prop="firstName">
                    <el-input v-model="editInstructor.firstName"></el-input>
                </el-form-item>
                <el-form-item label="last name" prop="lastName">
                    <el-input v-model="editInstructor.lastName"></el-input>
                </el-form-item>
                <el-form-item label="phone number" prop="phone">
                    <el-input v-model="editInstructor.phone"></el-input>
                </el-form-item>
                <el-form-item label="email address" prop="email">
                    <el-input v-model="editInstructor.email"></el-input>
                </el-form-item>
                <el-form-item label="status" prop="status">
                    <el-select v-model="editInstructor.status" placeholder="status">
                        <el-option key="1" label="activated" value="1"></el-option>
                        <el-option key="2" label="inactivated" value="2"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelAdd">Cancel</el-button>
                    <el-button type="primary" @click="addInstructor">add</el-button>
                </span>
        </el-dialog>

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
                instructors:[],
                tempInstructors:[],


                /**
                 * edit data
                 */
                editInstructor: {
                    id: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    status: '',
                },


                /**
                 * select data
                */
                selectFirstName:'',


                /**
                 *  control data
                 */
                addInstructorVisible:false,
                editVisible: false,

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
                    url: '/api/professors',
                }).then(res => {
                    this.instructors = res.data;
                    this.tempInstructors = res.data;
                }).catch(error => {
                    this.$message.error("data load failed");
                })
            },
            getInstructor(id){
                this.$axios({
                    method: 'get',
                    url: '/api/professor/' + id,
                }).then(res => {
                    this.editInstructor = res.data;
                    this.editVisible = true;
                    console.log(res.data);
                }).catch(error => {
                    this.$message.error("system error, pleases try later");
                });
            },

            /**
             * operation methods
             */
            updateInstructor() {
                this.$axios({
                    method: 'put',
                    url: '/api/professor',
                    data: this.editInstructor
                }).then(res => {
                    this.getData();
                    this.getInstructor(this.editInstructor.id);
                    this.$message.success(res.msg);
                }).catch(error => {
                    this.$message.error(error);

                })
            },

            /**
             * search methods
             */
            search(){
                this.instructors = this.tempInstructors;

                if (this.selectFirstName !== ''){
                    this.instructors = this.instructors.filter(item => {
                        return item.firstName.indexOf(this.selectFirstName) !== -1;
                    })
                }
            },
            cancelSearch(){
                this.instructors = this.tempInstructors;
                this.selectFirstName = '';
            },

            /**
             *  render methods
             */
            filterStatus(value, row) {
                return row.status === value;
            },
            slotContent(scope) {
                if (scope.row.status === '1') return 'activated'
                else if (scope.row.status === '2') return 'deactivated'
                else return 'missing'
            },
            tagType(scope) {
                if (scope.row.status === '1') return 'success'
                else if (scope.row.status === '2') return 'danger'
                else return 'warning';
            },


            /**
             *  common methods
             */

            change() {
                this.$forceUpdate();
            },

            deleteInstructor(id) {
                this.$confirm('This operation will permanently delete the record, do you want to continue?', 'Notification', {
                    confirmButtonText: 'confirm',
                    cancelButtonText: 'cancel',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'delete',
                        url: 'api/professor/' + id
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
            cancelEdit() {
                this.editVisible = false;
                this.getData();
            },
            cancelUpload() {
                this.uploadImgVisible = false;
            },
            openAddPage(){
                this.resetForm('addInstructor');
                this.addInstructorVisible = true;
            },
            resetForm(formName) {
                this.$nextTick(()=>{
                    this.$refs[formName].resetFields();
                })
            },

            /**
             *  add new instructor methods
             */
            cancelAdd(){
                this.addInstructorVisible = false;
            },
            addInstructor(){
                this.$axios({
                    method:'post',
                    url: "/api/professor",
                    data: this.editInstructor
                }).then(res => {
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
