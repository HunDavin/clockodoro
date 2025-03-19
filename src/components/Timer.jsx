import { useEffect, useState } from "react"


export default function Timer({ duration }) {
    const [Timeleft, setTimeleft] = useState(duration * 60);

    useEffect(() => {
        if (Timeleft === 0) {
            return;
        }

        const Interval = setInterval(() => {
            setTimeleft(Timeleft - 1);
        }, 1000);
        return () => clearInterval(Interval);



    }, [Timeleft]);

    const Min = Math.floor(Timeleft / 60);
    const Sec = Timeleft % 60;

    return <>
        <div>
            <span style={{ fontFamily: 'Rowdies, sans-serif' }}>
                <h1>{Min < 10 ? `0${Min}` : Min} : {Sec < 10 ? `0${Sec}` : Sec}</h1>
            </span>

        </div>


    </>
}