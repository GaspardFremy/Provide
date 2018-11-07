<script>

import { Pie } from 'vue-chartjs';

export default {
   extends: Pie,
   data () {
      return {
        datacollection: {
          //Data to be represented on x-axis
          labels: ['Stripe', 'Chek'],
          datasets: [
            {
              labels: [
                  'Stripe',
                  'check'
              ],
              backgroundColor: [
                  '#019AE8',
                  '#60D3A0'
              ],
              pointBackgroundColor: 'white',
              borderWidth: 1,
              pointBorderColor: '#249EBF',
              //Data to be represented on y-axis
              data: [40, 20]
            }
          ]
        },
        //Chart.js options that controls the appearance of the chart
          responsive: true,
          maintainAspectRatio: false,
          pieceLabel: {
            mode: 'percentage',
            precision: 1
         }
        }
      },
   mounted() {
      //renderChart function renders the chart with the datacollection and options object.
      this.renderChart(this.datacollection, this.options)
   }
}
</script>
