import React, { useEffect, useState } from "react";
import { Box} from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import '../../../auditor-list.component.css';
import { format } from "date-fns";
import { scheduleTran,AuditTransDto } from "services/audit.service";
import '../../schedule-tran.css'




const CarReportTransactionComponent = () => {

  const [data,setData]= useState(undefined);
  const [transaction,setTransaction] = useState([])


  const fetchData = async () => {
    try {
      const data = JSON.parse(localStorage.getItem('scheduleData'));
      if(data){
        setData(data)
       const trans = await scheduleTran(new AuditTransDto(data.correctiveActionId,'C'))
       setTransaction(trans)
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const carSta = {
    'INI': ' CAR Report Inititated By',
    'FWD': ' CAR Report Forwarded By',
    'CRH': ' CAR Report Returned By',
    'CMR': ' CAR Report Returned By',
    'CRM': ' CAR Report Recommended By',
    'CAP': ' CAR Report Approved By',
  };

  const back = ()=>{
    window.close();
  }


  return (
    <div>
      <Navbar />
      <div className="card">
         <Box display="flex" alignItems="center" gap="10px" >
          <Box flex="87%" className='text-center'><h3>{data && data.iqaNo}: CAR Report Transaction</h3></Box>
          <Box flex="13%"><button className="btn backClass" onClick={() => back()}>Back</button></Box>
         </Box>
          <Box className="col-md-11 card l-bg-blue-dark text-left-center-card mg-top-10"  >
            <Box display="flex" alignItems="center" gap="10px">
              <Box flex="18%"><span className="fw-bolder">Division/Group</span> - {data && data.divisionGroupCode}</Box>
              <Box flex="20%"><span className="fw-bolder">CAR Ref No</span> - {data && data.carRefNo}</Box>
              <Box flex="34%"><span className="fw-bolder">Description</span> - {data && data.carDescription}</Box>
              <Box flex="28%"><span className="fw-bolder">Responsibility </span> - {data && data.executiveName}</Box>
            </Box>
            <Box display="flex" alignItems="center" gap="10px">
              <Box flex="18%"><span className="fw-bolder">Target Date &emsp;&nbsp;</span>   - {data && data.targetDate && format(new Date(data.targetDate),'dd-MM-yyyy')}</Box>
              <Box flex="15%"><span className="fw-bolder">Completion Date</span> - {data && data.carCompletionDate && format(new Date(data.carCompletionDate),'dd-MM-yyyy')}</Box>
              <Box flex="67%"> </Box>
            </Box>
          </Box><br />
          <div id="card-body customized-card">
          <Box className="col-md-11  text-left-center-card mg-top-10"  >
            {transaction && transaction.length >0 && transaction.map(item =>{
                    let statusColor = `${item.auditStatus === 'INI'?'initiated-bg' : (item.auditStatus === 'FWD' ? 'forwarde-bg' : item.auditStatus === 'ARF'?'reschedule-bg':['CRH','CMR'].includes(item.auditStatus)?'returned-bg':['CRM'].includes(item.auditStatus)?'aditor-sub':'acknowledge-bg')}`;
              return(
                <>
                  <div className="timeline-row">
                   <div class="timeline-content" >
						        <h6 className={statusColor}> {carSta[item.auditStatus]}&nbsp;/&nbsp;<span >{item.empName}</span></h6> 
                      <p style={{ backgroundColor: "#f0f2f5", padding: "10px", borderRadius: "5px" }}>
                        {item.remarks ? (
                          <>
                            <span className="remarks_title" style={{ fontWeight: "bold" }}>Remarks : </span>
                            {item.remarks}
                          </>
                        ) : (
                          <span className="remarks_title" style={{ fontWeight: "bold" }}>No Remarks</span>
                        )}
                      </p>
						       </div>
                   <div class="timeline-dot fb-bg mid-line"></div>
                   <div class="timeline-time">
                     <div class="form-inline margin-half-top"><span className="date-styles">{format(new Date(item.transactionDate),'MMM dd, yyyy, hh:mm a')}</span></div>
                   </div>
                 </div>
                </>
              )
            })}
          </Box>
          </div>
        </div>
    </div>
  );

}
export default CarReportTransactionComponent;