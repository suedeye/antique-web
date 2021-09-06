import React, {useState, useEffect} from "react";
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

import {
    useParams,
    Link
  } from "react-router-dom";

export const ItemDetail = ()=> {
    const { id } = useParams()
    const [data, setData] = useState([])
    const [user, setUser] = useState([])
    const [autobidState, setAutobidState ] = useState([])
    const [bidValue, setBidValue] = useState(0)

    useEffect(() => {
        document.title = 'Antique Boutique | Bid';
    });

    useEffect(()=> {
        fetch(`/item-detail/${id}`)
        .then(response => response.json())
        .then(data => setData(data))      
    }, [id])

    useEffect(()=> {
        fetch('/user').then(response=> {
            if(response.ok){
                return response.json()
            }
        }).then(user => setUser(user))
    },[])

    useEffect(()=> {
        fetch(`/get-autobid/${id}`)
        .then(response => response.json())
        .then(autobidState => setAutobidState(autobidState))
    },[id])

    
    const bidItem = ()=> {        
        fetch(`/bid/${id}`,{
            method: 'POST',
            body: JSON.stringify({
                id: id,
                bid: bidValue
            })
        }).then(response => response.json())
        window.location.reload()
    }

    const handleAutobidChange = (event) => {
        setAutobidState(!autobidState.state)
        fetch(`/set-autobid`,{
            method: 'POST',
            body: JSON.stringify({
                id: id,
                state: !autobidState.state
            })
        }).then(response => response.json())
        window.location.reload()
    }

    const handleBidValue = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setBidValue(e.target.value)
        }
    }

    return(
        <div>
            {data.length > 0 && data.map(data => 
            <div key='id'>                
                <div>                    
                    <strong>
                        Name:{' '}
                    </strong>
                    {data.name}
                </div>  
                <div>                                      
                    <strong>
                        Description:{' '}
                    </strong>
                    {data.description}                     
                </div>
                <div>
                    <strong>
                        Initial price:{' '}
                    </strong>
                    {data.initial_price+'$'}  
                </div>  
                <div>
                    <strong>
                        Actual bid:{' '}
                    </strong>
                    {data.last_bid_user == null ? '----' : data.last_bid+'$'}
                </div>     
                <div>
                    <strong>
                        Actual user bid:{' '}
                    </strong>
                    {data.last_bid_user == null ? '----' : data.last_bid_user}
                </div>
                <div>
                        
                    <input type="text" name="name" value={bidValue} onChange={handleBidValue}/>
                    <Button variant="contained" color="primary" onClick={bidItem} disabled={data.last_bid_user === user.user}>
                    BID
                    </Button>
                </div>
                <div>
                    Auto-bid
                    <Checkbox checked={autobidState.state ? true : false} onChange={handleAutobidChange}/>
                </div>      
            </div>
            )}
            
            <hr></hr>
            <Link to='/home'>Back</Link>
        </div>
    )
}
