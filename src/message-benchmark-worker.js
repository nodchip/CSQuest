// A dedicated worker for the communication experiment. It receives cloned arrays.
self.onmessage=event=>{const {sequence,values}=event.data;let sum=0;for(const value of values)sum+=value*value;self.postMessage({sequence,count:values.length,sum});};
self.postMessage({ready:true});
