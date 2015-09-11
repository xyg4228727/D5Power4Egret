    function trace(...args)
    {
        var s:string = "";
        for(var i:number=0,j:number=args.length;i<j;i++)
        {
            s+=args[i]+" ";
        }
        console.log(s);
    }