using IronPython.Hosting;
using System;

namespace NetflixCLI
{
    class Program
    {
        static void Main(string[] args)
        {
            var ipy = Python.CreateRuntime();
            dynamic converter = ipy.UseFile(@"Scripts\NetflixToSRT.py");
            converter.main();

        }
    }
}
