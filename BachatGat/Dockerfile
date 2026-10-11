# Build context: BachatGat/ (docker build -f BachatGat/Dockerfile BachatGat)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish BachatGatAPI/BachatGatAPI.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
ENV Kestrel__Port=7001
EXPOSE 7001
ENTRYPOINT ["dotnet", "BachatGatAPI.dll"]
