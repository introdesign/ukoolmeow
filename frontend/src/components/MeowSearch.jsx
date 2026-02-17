import Meow from "../img/meow.jpg"
import Ukool from "../img/ukoolpro.png"

const MeowSearch = () => {
    return (
        <div className="my-5 mx-auto w-full flex flex-col items-center">
            
            
            <form className="search-form">
                <h1 className="text-3xl mb-4">Collect your meow and TNG here</h1>
                <input className="border p-4 w-96" id="meow"type="text" placeholder="Type a meow..." />
            </form>
           <div>

             <div className="">
                <span>Sponsored ads</span>
                <img className="scale-2000" src={Meow} alt="Meow" />
            </div>
             <div>
                <span>Sponsored ads</span>
                <img  src={Ukool} alt="ukool" />
            </div>
           </div>
        </div>
    );
}

export default MeowSearch;