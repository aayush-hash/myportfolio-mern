import mongoose from "mongoose";
import { stringify } from "postcss";
import postcss from 'postcss';


const softwareApplicationSchema = new mongoose.Schema({
      name:String,
      svg:{
            public_id:{
                  type:String,
                  required:true,
            },

      url:{
            type:String,
            required:true,
      },
      },
});

export const SoftwareApplication = mongoose.model("SoftwareApplication",softwareApplicationSchema);