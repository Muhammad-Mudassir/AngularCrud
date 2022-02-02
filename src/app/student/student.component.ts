import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from "@angular/forms";
import {StudentModel} from "./student.model";
import {ApiService} from "../shared/api.service";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit  {
  studentValue!:FormGroup
  studentObj:StudentModel = new StudentModel();
  studentList:any=[];
  btnSaveShow:boolean=true;
  btnUpdateShow:boolean=false;

  constructor( private formBuilder: FormBuilder,private api:ApiService) { }
  ngOnInit(): void {
    this.studentValue = this.formBuilder.group({
      name:[''],
      rollNum:[''],
      grade:['']
    })
    this.getStudent();

  }

  Addstudent() {
    this.studentObj.name = this.studentValue.value.name;
    this.studentObj.rollNum = this.studentValue.value.rollNum;
    this.studentObj.grade = this.studentValue.value.grade;
    this.api.postStudent(this.studentObj).subscribe({next:(v) =>
      {
        console.log(v)
      },
      error: (e) => {
      console.log(e)
        alert("Error")
      },
      complete:() => {
        this.getStudent();
      this.studentValue.reset();
      }
    })
  }

  getStudent() {
    this.api.getStudent().subscribe(res => {
      this.studentList = res;
    })

  }

  deleteStudent(id:number) {
    this.api.deleteStudent(id).subscribe({
      next: (v) => {
        console.log(v)
      },
      error: (e) => {
        console.log("Error")
        alert("Error")
      },
      complete: () => {
        this.getStudent();
      }})
  }

  editStudent(data:any) {
    this.studentValue.controls["name"].setValue(data.name);
    this.studentValue.controls["rollNum"].setValue(data.rollNum);
    this.studentValue.controls["grade"].setValue(data.grade);
    this.studentObj.id = data.id;
    this.showUpdate();
  }

  updateStudent()
  {
    this.studentObj.name = this.studentValue.value.name;
    this.studentObj.rollNum = this.studentValue.value.rollNum;
    this.studentObj.grade = this.studentValue.value.grade;
    this.api.putStudent(this.studentObj,this.studentObj.id).subscribe({next:(v) =>
      {
        console.log(v)
      },
      error: (e) => {
        console.log(e)
        alert("Error")
      },
      complete:() => {
        this.getStudent();
        this.studentValue.reset();
        this.showSave();
        this.studentObj.id = 0;
      }})
  }

  showSave()
  {
    this.btnSaveShow=true;
    this.btnUpdateShow=false;
  }
  showUpdate()
  {
    this.btnSaveShow=false;
    this.btnUpdateShow=true;
  }

}
