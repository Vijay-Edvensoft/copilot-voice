export const stringUpperCase = (word: string): string => {

    return word?.charAt(0)?.toUpperCase() + word?.slice(1)
}


export const getDuration = (startTimeString: string) => {
    const startTime = new Date(startTimeString);
    const currentTime = new Date();
    const diff = currentTime.getTime() - startTime.getTime();
    // const sec = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return days === 0
        ? hours === 0
            ? `${minutes} minute`
            : `${hours} hours`
        : `${days} days`;
};

export const downloadurl=(url:string)=>{
 const a = document.createElement("a");
    a.href = url;
    a.download = "chart.png";
    a.click();
}