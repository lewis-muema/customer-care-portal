<template>
  <div class="box box-info">
    <div class="box-body">
      <div class="error-page">
        <h3>An error was Encountered!</h3>
        <h6><strong>Error: </strong> {{ errors[error.statusCode] }}</h6>
        <h6><strong>Status Code: </strong> {{ error.statusCode }}</h6>

        <p>Back to <a href="/orders">safety</a>!</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['error'],
  data() {
    return {
      errors: {
        400: 'Bad Request. Kindly contact tech support',
        404: 'Resource requested could not be found. Kindly contact tech support',
        500: 'Internal Server Error. Kindly refresh the page. If error persists contact tech support',
        403: 'Forbidden. Your access token has expired. Kindly logout and login again. If error persists contact tech support',
      },
    };
  },
};
</script>
