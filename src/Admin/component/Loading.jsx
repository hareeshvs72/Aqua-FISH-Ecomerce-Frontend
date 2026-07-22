import {
Loader2
  
} from 'lucide-react';

const Loading = ()=>{
       <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
            <Loader2 size={36} className="text-blue-500 animate-spin mr-3" />
            <span className="text-slate-500 font-medium">Loading orders...</span>
    </div>
}

export default Loading