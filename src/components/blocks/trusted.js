import React from "react";
import github from '../../img/github.png';
import steam from '../../img/steam.png';
import microsoft from '../../img/microsoft.png';
import gpt from '../../img/gpt.png';

const Trusted = () => { 
    return (
        <div className='trusted'>
    <h1 className='trusted-text'>No one from these companies trusts us.</h1>
    <div className='trusted-logos'>
    <img src={github} alt='a' className='trusted-logo'/>
    <img src={steam} alt='a' className='trusted-logo'/>
    <img src={microsoft} alt='a' className='trusted-logo'/>
    <img src={gpt} alt='a' className='trusted-logo'/>
    </div>
    </div>
    );
}
export default Trusted;