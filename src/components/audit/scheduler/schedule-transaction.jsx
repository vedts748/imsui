import React, { useEffect, useState } from "react";
import { Box} from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import '../auditor-list.component.css';
import { format } from "date-fns";
import { scheduleTran } from "../../../services/audit.service";
import './schedule-tran.css'




const ScheduleTransactionComponent = () => {

  const [data,setData]= useState(undefined);
  const [transaction,setTransaction] = useState([])


  const fetchData = async () => {
    try {
      const data = JSON.parse(localStorage.getItem('scheduleData'));
      if(data){
        setData(data)
        console.log('data------ ',data)
       const trans = await scheduleTran(data.scheduleId)
       console.log('trans------- ',trans)
       setTransaction(trans)
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scheduleSta = {
    'INI': ' Schedule Inititated By',
    'FWD': ' Schedule Forwarded By',
    'ARF': ' Schedule Reforwarded By',
    'ASR': ' Schedule Returned By',
    'ARL': ' Schedule Returned By',
    'ASA': ' Schedule Acknowledged By',
    'AAL': ' Schedule Acknowledged By',
};




  return (
    <div>
      <Navbar />
      <div className="card">
         <Box display="flex" alignItems="center" gap="10px" >
          <Box flex="100%" className='text-center'><h3>{data && data.iqaNo}: Audit Schedule Transaction</h3></Box>
         </Box>
          <Box className="col-md-11 card l-bg-blue-dark text-left-center-card mg-top-10"  >
            <Box display="flex" alignItems="center" gap="10px">
              <Box flex="20%"><span className="fw-bolder">Date & Time (Hrs)</span> - {data && data.scheduleDate && format(new Date(data.scheduleDate),'dd-MM-yyyy HH:mm')}</Box>
              <Box flex="30%"><span className="fw-bolder">Division/Group/Project</span> - {data && (data.divisionName !== ''?data.divisionName:data.groupName !== ''?data.groupName:data.projectName)}</Box>
              <Box flex="23%"><span className="fw-bolder">Auditee</span> - {data && data.auditeeEmpName}</Box>
              <Box flex="15%"><span className="fw-bolder">Team</span> - {data && data.teamCode}</Box>
              <Box flex="12%"><span className="fw-bolder">Revision</span>  - R{data && data.revision}</Box>
            </Box>
          </Box><br />
          <div id="card-body customized-card">
          <Box className="col-md-11  text-left-center-card mg-top-10"  >
            {transaction && transaction.length >0 && transaction.map(item =>{
                    let statusColor = `${item.auditStatus === 'INI'?'initiated-bg' : (item.auditStatus === 'FWD' ? 'forwarde-bg' : item.auditStatus === 'ARF'?'reschedule-bg':['ASR','ARL'].includes(item.auditStatus)?'returned-bg':['ASA','AAL'].includes(item.auditStatus)?'lead-auditee-bg':'acknowledge-bg')}`;
              return(
                <>
                  <div className="timeline-row">
                   <div class="timeline-content" >
						        <h6 className={statusColor}> {scheduleSta[item.auditStatus]}&nbsp;/&nbsp;<span >{item.empName}</span></h6> 
						       </div>
                   <div class="timeline-dot fb-bg mid-line"></div>
                   <div class="timeline-time">
                     <div class="form-inline margin-half-top"><span className="date-styles">{format(new Date(item.transactionDate),'MMM dd, yyyy, HH:MM a')}</span></div>
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
export default ScheduleTransactionComponent;