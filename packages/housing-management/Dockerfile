FROM public.ecr.aws/lambda/nodejs:18 as builder
WORKDIR /usr/app
COPY package.json ./
COPY packages/shared ./shared/
COPY packages/housing-management ./housing-management/
RUN npm install && \
    cd housing-management && npm install && npm run build

FROM public.ecr.aws/lambda/nodejs:18
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/housing-management/dist/* ./
CMD ["index.handler"]
