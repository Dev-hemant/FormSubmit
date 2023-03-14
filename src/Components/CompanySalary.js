import React,{useEffect,useState} from "react";
import axios from "axios";

const CompanySalary = () =>{
    const [data,setData] = useState([]);
    const [TotalmaleEmpSalary,setTotalmaleEmpSalary] = useState(0);
    const [TotalfemaleEmpSalary,setTotalfemaleEmpSalary] = useState(0);
    const workingDay = [2,4,6];
    const salaryPerDay = 500;
    useEffect(()=>{
        axios.get("http://34.198.81.140/attendance.json").then((response)=>{
            let supervisorsSalary = 0;
            let maleEmpSalary = 0;
            let femaleEmpSalary = 0;
            let otherSalary = 0;
            let male = [];
            let female = [];
            if(response.data) {
                response.data.map((resp)=>{
                    if(new Date(resp.date).getMonth() ===  1) {
                        if(resp.total_hours >= 4) {
                            if(resp.designation === 'Supervisor') {
                                    let amount = 0;
                                    if(resp.total_hours > 8.25) {
                                        let total = resp.per_day_salary*2;
                                        amount = amount+total;
                                    } else if(resp.total_hours === 8.25) {
                                        amount = resp.per_day_salary;
                                    } else if(resp.total_hours > 4 && resp.total_hours < 8.25) {
                                        let total = resp.per_day_salary/2;
                                        amount = amount+total;
                                    }
                                    if(resp.gender === 'Male') {
                                        maleEmpSalary = maleEmpSalary+amount;
                                        male.push(amount);
                                    } else {
                                        femaleEmpSalary = femaleEmpSalary+amount;
                                        female.push(amount);
                                    }
                                    supervisorsSalary = supervisorsSalary+amount;
                            } else {
                                const perHrs = resp.per_day_salary/8.25;
                                let amount = 0;
                                if(resp.total_hours > 8.25) {
                                    const diffHrs = Math.round(resp.total_hours - 8.25);
                                    let total = resp.per_day_salary+(diffHrs*perHrs);
                                    amount = otherSalary+total;
                                } else if(resp.total_hours === 8.25) {
                                    amount = resp.per_day_salary;
                                } else if(resp.total_hours > 4 && resp.total_hours < 8.25) {
                                    let total = resp.per_day_salary/2;
                                    amount = otherSalary+total;
                                }
                                if(resp.gender === 'Male') {
                                    console.log("maleEmpSalary",maleEmpSalary);
                                    maleEmpSalary = maleEmpSalary+amount;
                                    male.push(amount);
                                } else {
                                    femaleEmpSalary = femaleEmpSalary+amount;
                                    female.push(amount);
                                }
                                otherSalary = otherSalary+amount;
                            }
                        }
                    }
                });
                setTotalmaleEmpSalary(maleEmpSalary);
                setTotalfemaleEmpSalary(femaleEmpSalary);
                console.log("male",male);
                console.log("female",female);
            }
        });
    });
    return(<React.Fragment>
        Male : {TotalmaleEmpSalary} <br />
        Female : {TotalfemaleEmpSalary}
    </React.Fragment>);
}
export default CompanySalary;