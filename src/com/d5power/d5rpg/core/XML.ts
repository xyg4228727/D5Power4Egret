module d5power
{
    export class XML
    {
        public constructor(data:any)
        {
           for(var k in data)
           {
               console.log(k,data[k]);
           }
        }
    }
}