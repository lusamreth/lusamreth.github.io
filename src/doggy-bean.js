
import React, { useState, useEffect } from "react";
import downarrow from "./down-arrow.svg"
import axios from 'axios'

import './doggy.css'
const BREED_URL = "https://api.thedogapi.com/v1/breeds"
const API_KEY = 'b042ab80-e7e5-48dd-9f21-7a61e142fb94'

class DogCategory { 
   constructor(){
        // this.buffer = buffer
        this.baseUrl= BREED_URL
        this.storage = localStorage
   }

   cache(breed){
       this.storage.setItem('breedlist',JSON.stringify({...breed,timestamp : new Date()}))
   }

   get_breed(){
    return this.storage.getItem('breedlist')
   }
   
    search_breed(breed){
        let breedlist = this.storage.getItem('breedlist')
        return breedlist.filter(b => breed === b.name)
    }

   fetch(){
       let existed = this.get_breed() 
       if (existed !== null){
           return this.get_breed()
       }

        axios.get(this.baseUrl, {
            headers : {
                'x-api-key':API_KEY
            }
        })
        .then(res => { 
            this.cache(res.data)
            return res.data
        })
   }
    reset(){
        this.storage.clear()
    }
}


function EachDogPanel(eachBreedprop){
    let bucket = eachBreedprop.bucket
    // let bucket_size = eachBreedprop.bucket_size
    console.log('bucket',bucket)
    if (bucket === null){ 
        return <h1 className="waiting">Not yet loaded!</h1>
    }
    return (
    <div className="breeds">
        {
            bucket.map( eachBreed => {
            let panelName = `each-panel ${eachBreed['name']}`
            let desc = {
                id : eachBreed.id,
                lifespan :eachBreed.life_span,
                bred_for : eachBreed.bred_for,
                height : eachBreed.height,
                temperament : eachBreed.temperament,
                weight : eachBreed.weight
            }
           return (
               <div key={eachBreed['id'] + new Date().getMilliseconds()} className={panelName}>
                   <DogBreedPanel 
                    name={eachBreed["name"]} 
                    description={eachBreed['description']}
                    desc={desc}
                    measurement={eachBreedprop.measurement}
                    darkmode = {eachBreedprop.darkmode}
                    url={eachBreed["image"]["url"]}/>
               </div>
           )

            } )
        }
    </div>
    )
}

function Loader(prop){
    const styling = {
        backgroundColor: 'white',
        border:`5px solid ${prop.darkmode ? 'rgb(110, 117, 122)'  : '#3E4245'}`
    }
    return (
        <div className="fetch-info">
        { !prop.end ?
            <button className="load-more" onClick={prop.fetchmore} style={styling}> 
                <img src={downarrow} alt="arrow-down" />
            </button>
            :<h1 className="end">Reach the end!</h1>
        }
        </div>
    )
}


const SCOOPSIZE = 20;


function DogBreedCategory(prop){
    // let amount = prop.amount 
    let [dogBreedData,setdata] = useState(null)
    let [ptr , setptr] = useState({
        start : 0,
        end : SCOOPSIZE
    });
    let [end, setEnd] = useState(false)
    let [bucket,setbucket] = useState([])

    let darkmode = prop.darkmode

    function loadmore(){
        if (dogBreedData === null || end) return 

        setptr(e => {
            e.start = e.end
            e.end = SCOOPSIZE + e.end

            if (e.end  > dogBreedData.length ) {
                e.end = dogBreedData.length  - 1
                setEnd(b => !b)
            }
            return e
        })


        setbucket(prevbuck => {
            return [...prevbuck, ...dogBreedData.slice(ptr.start + 1 ,ptr.end )]
        })
    }

    useEffect(()=> {
        let bean = new DogCategory()
        let dt = JSON.parse(bean.fetch())

        let slicable = Object.keys(dt).map( key => {
            return dt[key]
        } )
        setdata(slicable)
        setbucket(_ => slicable.slice(ptr.start, ptr.end))
    },[])



    let outterStyle = {
        backgroundColor: darkmode ? '#3E4245'  : 'white'
    }

    return (
        <div className="outter-layout" style={outterStyle}>
            {dogBreedData == null ? <h1>waiting</h1> : 
                <EachDogPanel bucket={bucket} bucket_size={20} darkmode={darkmode} measurement={prop.measurement}/>
            }
            <Loader fetchmore={loadmore} darkmode={darkmode} end={end}/>
        </div>

        )

}

function measurement_affix(system){
    let res 
    switch(system){
        case 'metric':
            res = { weight:'kg', height:'cm'}
            break;

        case 'imperial':
            res = { weight:'lbs', height:'feet'}
            break;

        default :
            Error("Unsupported metric")
            break;

    }
    return res
}


function DogBreedDesc(prop){
    const desc = prop.desc
    const dke = Object.keys(desc)
    const measurement = prop.measurement || 'metric'
    const prone = (dke.map((key_desc,i) => {
        let cls_name = `inner-desc-text ${key_desc}`
        let text = desc[key_desc]

        let affix = measurement_affix(measurement)
        const keys = ['height','weight']
        const isMeasurement = keys.filter(k => k === key_desc) 
        if (isMeasurement.length > 0){
            text = `${text[measurement]}${affix[isMeasurement]}`
        }
        const kk = desc.id + i
        return (
            <div className="inner-desc" key={kk}>
                <p className="key-desc">{key_desc} : </p>
                <p className={cls_name}>{text}</p>
            </div>
        )
    }))
    return (
        <div className="description">
            {prone}
        </div>
    )
    
}

function DogBreedPanel(prop){
    let img_uri = prop.url
    let desc = prop.desc
    let cls_id = `panel dog-${desc.id}`
    let meas = prop.measurement
    let [toggleState ,setToggle] = useState(false);
    const panelStyle = {
        backgroundColor: prop.darkmode ?  "#6E757A" : "#212121",
        color:prop.darkmode ? "white" : 'white'
    }
    function enlargePicture(){
        setToggle(_ => !toggleState)
    }
    
    // console.log(prop.description)
    return (
        <div className={cls_id} key={desc.id + new Date()} style={panelStyle} onClick={enlargePicture}>

            <div className="panel-inner">
                <div className="picture-showcase">
                    { img_uri == null ? 
                        <p>no-image</p>:  
                        <div className="dog-img">
                            <img src={img_uri} alt="doggu_img" className="inner-image"/>
                        </div>
                    }
                </div>
            </div>
            { toggleState &&  
            <div className="text">
                <h1 className="panel-title">{prop.name}</h1>
                <div className="description-wrapper">
                    <h1 className='desc-header'>Description</h1>
                    <DogBreedDesc desc={desc} measurement={meas}/>
                </div>
            </div>
            }
        </div>
	);
}

export default DogBreedCategory
