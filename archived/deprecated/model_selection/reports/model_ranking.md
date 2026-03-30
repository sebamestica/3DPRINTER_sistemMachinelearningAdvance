# Ranking de Modelos

| Model                     |   Test_MAE |   Test_RMSE |    Test_R2 |   Test_MAPE |
|:--------------------------|-----------:|------------:|-----------:|------------:|
| LinearRegression          |    3.41312 |     4.26268 |  0.781632  |     22.1407 |
| Lasso                     |    3.56715 |     4.26558 |  0.781335  |     30.7539 |
| Ridge                     |    3.4164  |     4.43378 |  0.763749  |     21.0785 |
| ElasticNet                |    3.74959 |     4.63533 |  0.741782  |     34.9148 |
| RandomForestRegressor     |    3.761   |     4.68441 |  0.736285  |     36.0785 |
| GradientBoostingRegressor |    3.56076 |     5.0009  |  0.699447  |     30.4991 |
| DummyRegressor            |    8.5     |     9.17505 | -0.0116769 |     83.3197 |