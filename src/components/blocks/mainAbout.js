import React from "react";
import firstImage from '../../img/first.png';
const About = () => {
    return (
        <section className="info-block">
            <div className="info-main-block">
            <div className="info-item">
              <div className="info-red">
            <h1>Uncharted Zone</h1>
            <p className="highlight"> Unsecured App.
            Your wealth is <a className='text-gradient'>never truly safe.</a></p>
         </div>
          </div>
          <div className="info-item">
          <img src={firstImage} alt='aa' />
         </div>
         </div>
          </section>
    )
}
export default About;