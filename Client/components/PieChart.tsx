"use client"

import * as React from "react"
import styles from "../styles/dashboard.module.css"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


export default function Component(data: any) {
  // console.log(chartData)
  const chartData = data.chartData;
  const chartConfig = data.chartConfig;
  console.log(chartData);
  console.log(chartConfig);
  const totalQuestions = React.useMemo(() => {
    return chartData.reduce((acc:any, curr:any) => acc + curr.questions, 0)
  }, [])
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Batch {data.year}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="questions"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalQuestions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Questions
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className={styles.PieChart}>
          <div className={styles.PieChartAccuracy}>
            <div >91.78</div>
            <div >Accuracy</div>
          </div>
          <div className={styles.PieChartAccuracy}>
            <div >71</div>
            <div>Correct Questions</div>
          </div>
        </div>
        <div className={styles.PieChart}>
          <div className={styles.PieChartAccuracy}>
            <div >3</div>
            <div>Incorrect Questions</div>
          </div>
          <div className={styles.PieChartAccuracy}>
            <div >2</div>
            <div>Skipped Questions</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}