import React from 'react'
import { useState } from 'react'
import { MessageCircleReplyIcon } from 'lucide-react';
import { authStore } from '../store/useAuthStore';
import { Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const verifyEmail = () => {

    const {  verifyEmail, verifyingEmail} = authStore()
    const [otp, setOtp] = useState(new Array(6).fill(""));
const navigate = useNavigate();
    const handleChange = (e, index) => {
        if (!/^\d$/.test(e.target.value)) return;

        setOtp([...otp.map((data, idx)=> (idx === index ? e.target.value : data))])


        const target = e.target;
        if(target.value && target.nextSibling) {
            target.nextSibling.focus();
        }
    }

    const handlePaste = (e) => {
        const pastedValue = e.clipboardData.getData("text").trim();
          if (!/^\d+$/.test(pastedValue)) return;

          const updatedOtp = pastedValue.split("").slice(0, 6);

          setOtp(updatedOtp.concat(new Array(6 - updatedOtp.length).fill("")));

          setTimeout(() => {
              const inputs = document.querySelectorAll("input[type ='text']");
              inputs[Math.min(5, updatedOtp.length)].focus();
          }, 0);
    }

    const handleKeyDown = (e,index)=> {
        if(e.key === "Backspace"){
            e.preventDefault();
            setOtp((prevOtp)=> {
                const newOtp = [...prevOtp];
                newOtp[index] = "";

                if(index > 0 ){
                    setTimeout(()=>{
                           const prevInput = document.querySelectorAll("input[type ='text']")[index - 1];
                        prevInput?.focus();
                    },10 )
                }
                return newOtp;
            })
        }

    }
    const handleSubmitVerification = async () => {
        const otpCode = otp.join("");
        const isValid = await verifyEmail(  otpCode );
        if (isValid) {
            toast.success("Email has been verified successfully! Please log in.");
            navigate("/login");
    
        } else {
            toast.error("Email verification failed. Please try again.");
        }
    }

    const userEmail = authStore((state) => state.user?.email);
  return (
     <main className='flex h-screen w-full items-center justify-center bg-zinc-400'>
            <div className='bg-white py-8 px-12 rounded-lg shadow-lg'>
                <div className='flex items-center justify-center'>
                    <MessageCircleReplyIcon className='text-5xl text-zinc-500' />
                </div>


                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-2xl text-center mt-4 font-bold text-zinc-500 '>
                        Please Check Your Email
                    </h1>
                    <p className='text-center mt-2 text-zinc-500  '>
                        We have sent a code <span className=' text-black font-semibold'>{userEmail ? userEmail : "You"}</span>
                    </p>
                </div>

                <div className='flex gap-4 items-center justify-center mt-4'>
                    {
                        otp.map((data, i) => {
                            return <input
                                className='border-[1px] border-black w-12 h-12 text-center text-2xl font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-40 cursor-pointer focus:cursor-text'
                                key={i}
                                type='text'
                                value={data}
                                onChange={(e) => handleChange(e, i)}
                                onPaste={handlePaste}
                                maxLength={1} // i dont really need this just for safety
                                onKeyDown={(e) => handleKeyDown(e, i)}
                            />
                        })
                    }
                </div>

                <div className='w-full flex flex-col items-center justify-center mt-4'>
                <button className='bg-blue-500 w-full p-3 rounded-md text-white flex items-center justify-center hover:bg-gray-400 hover:text-black transition duration-300' onClick={handleSubmitVerification }>
                        {verifyingEmail  ? <Loader className='animate-spin size-5 ' color='white'  /> : "Verify Email"}
                        
                    </button>
                    <p className='text-gray-400 mt-4'>Didnt recieve an Email? <span className='text-black cursor-pointer'>Resend Code</span></p>
                </div>
            </div>
        </main>
  )
}

export default verifyEmail
