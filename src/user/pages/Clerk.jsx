    import { useClerk, useUser } from '@clerk/clerk-react'
    import React from 'react'
  
    function Clerk() {
          const {user,isSignedIn} = useUser()
    const {openSignIn,openSignUp} = useClerk()
    return (
        <div>
             <button onClick={()=>openSignIn()}>
                sign in
             </button>
        </div>
    )
    }

    export default Clerk