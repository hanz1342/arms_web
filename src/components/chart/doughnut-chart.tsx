import { Doughnut } from "react-chartjs-2";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

interface DoughnutProps {
    categories: any[] 
}

const DoughnutChart = (props: DoughnutProps) => {
    const categories = props.categories.filter(value => value.category !== '-');
    const labels = categories?.map(value => value.category);
    const datas = categories?.map(value => value.count);
    const colors = datas.length > 0 ? ['#FACC15', '#54E69D', '#85B4F2', '#3f8600'] : [];

    const data = {
        labels,
        datasets: [
            {
                label: 'Treatment Category', 
                data: datas,
                backgroundColor: colors,
                borderColor: colors,
                cutout: '78%',
            }
        ]
    }

    const dougnutLabel = {
        id: 'dougnutLabel', 
        afterDatasetsDraw(chart: any, args: any, plugins: any) {
            const {ctx, data} = chart;

            // const centerX = chart.getDatasetMeta(0).data[0].x;
            // const centerY = chart.getDatasetMeta(0).data[0].y;

            ctx.save();
            ctx.font = 'bold 14px sans-serif';
            ctx.fillStyle = '#8a92a6';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // ctx.fillText(`Total Value: ${data.datasets[0].data[0]}`, centerX, centerY);
        }
    }
    
    return (
        <Doughnut 
            data={data} 
            // options={{
            //     aspectRatio: 1.8,
            //     plugins: {
            //         legend: {
            //             position: 'top'
            //         }
            //     }
            // }}
            plugins={[dougnutLabel]}
        />
    )
}

export default DoughnutChart;