import React from 'react'
import './Programs.css'
import program1 from '../../assets/program1.png'
import program2 from '../../assets/program2.png'
import program3 from '../../assets/program3.png'
import program4 from '../../assets/program4.png'
import program_icon_1 from '../../assets/program_icon_1.png'
import program_icon_2 from '../../assets/program_icon_2.png'
import certificate_icon from '../../assets/certificate_icon.png'
import certificate_icon1 from '../../assets/certificate_icon1.png'
import ProgramCard from '../programCard'



const Programs = () => {
  return (
    <div className='programs'>
            <ProgramCard
            image={program1}
            icon={program_icon_1}
            title="Graduation Degree" />


       <ProgramCard 
        image={program2} 
        icon={program_icon_2} 
        title="PhD" 
      />

       <ProgramCard 
        image={program3} 
        icon={certificate_icon} 
        title="MBA" 
      />

        <ProgramCard 
        image={program4} 
        icon={certificate_icon1} 
        title="Business" 
        tall={true}
      />
    </div>

  )
}

export default Programs